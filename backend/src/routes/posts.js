import express from 'express'
import { auth } from '../middleware/auth.js'
import Post from '../models/Post.js'
import User from '../models/User.js'
import Notification from '../models/Notification.js'

const router = express.Router()

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const { content, images, links, hackathon, visibility } = req.body

    const post = new Post({
      author: req.userId,
      content,
      images: images || [],
      links: links || [],
      hackathon,
      visibility: visibility || 'public'
    })

    await post.save()

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username name avatar')
      .populate('hackathon', 'name')

    res.status(201).json({ post: populatedPost, message: 'Post created successfully' })
  } catch (error) {
    console.error('Create post error:', error)
    res.status(500).json({ error: 'Failed to create post' })
  }
})

// Get feed (posts from followed users)
router.get('/feed', auth, async (req, res) => {
  try {
    const { limit = 20, skip = 0 } = req.query
    const user = await User.findById(req.userId)

    const posts = await Post.find({
      $or: [
        { author: { $in: [req.userId, ...user.following] }, visibility: { $in: ['public', 'followers'] } },
        { visibility: 'public' }
      ]
    })
      .populate('author', 'username name avatar')
      .populate('hackathon', 'name')
      .populate('likes', 'username name avatar')
      .populate('comments.user', 'username name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))

    res.json({ posts })
  } catch (error) {
    console.error('Get feed error:', error)
    res.status(500).json({ error: 'Failed to fetch feed' })
  }
})

// Get post by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username name avatar')
      .populate('hackathon', 'name')
      .populate('likes', 'username name avatar')
      .populate('comments.user', 'username name avatar')

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    res.json({ post })
  } catch (error) {
    console.error('Get post error:', error)
    res.status(500).json({ error: 'Failed to fetch post' })
  }
})

// Like post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    // Check if already liked
    if (post.likes.includes(req.userId)) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== req.userId)
    } else {
      // Like
      post.likes.push(req.userId)

      // Create notification if not own post
      if (post.author.toString() !== req.userId) {
        const user = await User.findById(req.userId)
        await Notification.create({
          recipient: post.author,
          sender: req.userId,
          type: 'like',
          title: 'New Like',
          message: `${user.name} liked your post`,
          data: { postId: post._id }
        })
      }
    }

    await post.save()

    res.json({ likes: post.likes.length, isLiked: post.likes.includes(req.userId) })
  } catch (error) {
    console.error('Like post error:', error)
    res.status(500).json({ error: 'Failed to like post' })
  }
})

// Comment on post
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    post.comments.push({
      user: req.userId,
      text
    })

    await post.save()

    // Create notification if not own post
    if (post.author.toString() !== req.userId) {
      const user = await User.findById(req.userId)
      await Notification.create({
        recipient: post.author,
        sender: req.userId,
        type: 'comment',
        title: 'New Comment',
        message: `${user.name} commented on your post`,
        data: { postId: post._id }
      })
    }

    const populatedPost = await Post.findById(post._id)
      .populate('comments.user', 'username name avatar')

    res.json({ comments: populatedPost.comments })
  } catch (error) {
    console.error('Comment error:', error)
    res.status(500).json({ error: 'Failed to comment' })
  }
})

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    // Check if user is author
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only author can delete the post' })
    }

    await Post.findByIdAndDelete(req.params.id)

    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Delete post error:', error)
    res.status(500).json({ error: 'Failed to delete post' })
  }
})

export default router
