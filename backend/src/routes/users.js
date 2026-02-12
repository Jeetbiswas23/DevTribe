import express from 'express'
import { auth } from '../middleware/auth.js'
import User from '../models/User.js'
import mongoose from 'mongoose'

const router = express.Router()

// Get all users (with optional search)
router.get('/', auth, async (req, res) => {
  try {
    const { search, limit = 50 } = req.query

    let query = {}
    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
          { skills: { $in: [new RegExp(search, 'i')] } }
        ]
      }
    }

    const users = await User.find(query)
      .select('-password')
      .limit(parseInt(limit))
      .sort({ lastActive: -1 })

    res.json({ users })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// Get suggested users (Friends of Friends or Random)
router.get('/suggestions', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId)

    // Get list of users already followed
    const followingIds = currentUser.following.map(id => id.toString())
    followingIds.push(currentUser._id.toString()) // Exclude self

    // 1. Try to find "friends of friends"
    // Fetch all users that the current user is following
    const followingUsers = await User.find({ _id: { $in: followingIds } }).populate('following')

    // Collect all unique user IDs that the following users are following
    const friendsOfFriendsIds = new Set()
    followingUsers.forEach(user => {
      user.following.forEach(friend => {
        if (!followingIds.includes(friend._id.toString())) {
          friendsOfFriendsIds.add(friend._id.toString())
        }
      })
    })

    let suggestions = []

    // If we have friends of friends, fetch them
    if (friendsOfFriendsIds.size > 0) {
      suggestions = await User.find({ _id: { $in: Array.from(friendsOfFriendsIds) } })
        .select('name username avatar role userType skills')
        .limit(5)
    }

    // 2. If not enough suggestions, fill with random users
    if (suggestions.length < 5) {
      const remainingCount = 5 - suggestions.length
      const potentialRandomIds = [...suggestions.map(u => u._id), ...followingIds]

      const randomUsers = await User.aggregate([
        { $match: { _id: { $nin: potentialRandomIds.map(id => new mongoose.Types.ObjectId(id)) } } },
        { $sample: { size: remainingCount } },
        { $project: { name: 1, username: 1, avatar: 1, role: 1, userType: 1, skills: 1 } }
      ])

      suggestions = [...suggestions, ...randomUsers]
    }

    res.json({ suggestions })
  } catch (error) {
    console.error('Get suggestions error:', error)
    res.status(500).json({ error: 'Failed to fetch suggestions' })
  }
})

// Get user by username
router.get('/:username', auth, async (req, res) => {
  try {
    const username = req.params.username.replace('@', '')
    const user = await User.findOne({ username })
      .select('-password')
      .populate('following', 'username name avatar')
      .populate('followers', 'username name avatar')
      .populate('teams')
      .populate('hackathons')

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body
    const allowedUpdates = [
      'name', 'bio', 'location', 'website', 'github', 'linkedin', 'twitter',
      'skills', 'interests', 'avatar',
      // Professional fields
      'experience', 'company', 'position', 'yearsOfExperience', 'expertise',
      'certifications', 'phone'
    ]

    const updateKeys = Object.keys(updates)
    const isValidUpdate = updateKeys.every(key => allowedUpdates.includes(key))

    if (!isValidUpdate) {
      return res.status(400).json({ error: 'Invalid updates' })
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password')

    res.json({ user, message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

// Follow user
router.post('/:username/follow', auth, async (req, res) => {
  try {
    const username = req.params.username.replace('@', '')
    const userToFollow = await User.findOne({ username })

    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (userToFollow._id.toString() === req.userId) {
      return res.status(400).json({ error: 'Cannot follow yourself' })
    }

    const currentUser = await User.findById(req.userId)

    // Check if already following
    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ error: 'Already following this user' })
    }

    // Add to following and followers
    currentUser.following.push(userToFollow._id)
    userToFollow.followers.push(currentUser._id)

    await currentUser.save()
    await userToFollow.save()

    res.json({ message: 'User followed successfully' })
  } catch (error) {
    console.error('Follow user error:', error)
    res.status(500).json({ error: 'Failed to follow user' })
  }
})

// Unfollow user
router.post('/:username/unfollow', auth, async (req, res) => {
  try {
    const username = req.params.username.replace('@', '')
    const userToUnfollow = await User.findOne({ username })

    if (!userToUnfollow) {
      return res.status(404).json({ error: 'User not found' })
    }

    const currentUser = await User.findById(req.userId)

    // Remove from following and followers
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== userToUnfollow._id.toString()
    )
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== currentUser._id.toString()
    )

    await currentUser.save()
    await userToUnfollow.save()

    res.json({ message: 'User unfollowed successfully' })
  } catch (error) {
    console.error('Unfollow user error:', error)
    res.status(500).json({ error: 'Failed to unfollow user' })
  }
})

// Get user's followers
router.get('/:username/followers', auth, async (req, res) => {
  try {
    const username = req.params.username.replace('@', '')
    const user = await User.findOne({ username })
      .populate('followers', 'username name avatar bio')

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ followers: user.followers })
  } catch (error) {
    console.error('Get followers error:', error)
    res.status(500).json({ error: 'Failed to fetch followers' })
  }
})

// Get user's following
router.get('/:username/following', auth, async (req, res) => {
  try {
    const username = req.params.username.replace('@', '')
    const user = await User.findOne({ username })
      .populate('following', 'username name avatar bio')

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ following: user.following })
  } catch (error) {
    console.error('Get following error:', error)
    res.status(500).json({ error: 'Failed to fetch following' })
  }
})

export default router
