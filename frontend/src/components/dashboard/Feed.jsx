import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Feed() {
  const navigate = useNavigate()
  // State declarations first
  const [newPost, setNewPost] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [commentText, setCommentText] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [followedUsers, setFollowedUsers] = useState([])
  const [repostMessage, setRepostMessage] = useState("")
  const [repostingPost, setRepostingPost] = useState(null)

  // Load posts from localStorage or use default
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('posts')
    return savedPosts ? JSON.parse(savedPosts) : [
      {
        id: 1,
        author: "Sarah Chen",
        username: "@sarahchen",
        role: "Full Stack Developer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        content:
          "Just launched our new AI-powered hackathon matching system! Looking for collaborators for our next project.",
        image: null,
        timestamp: "2 hours ago",
        likes: 24,
        comments: [],
        liked: false,
      },
      {
        id: 2,
        author: "Mike Johnson",
        username: "@mikej",
        role: "React Specialist",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
        content: "Amazing experience at DevTribe hackathon! Built a real-time collaboration tool with an amazing team.",
        image: null,
        timestamp: "4 hours ago",
        likes: 42,
        comments: [],
        liked: false,
      },
    ]
  })

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts))
  }, [posts])

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && !event.target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showEmojiPicker])

  const emojis = ["😀", "😂", "❤️", "🔥", "👍", "🎉", "💯", "🚀", "👏", "💪"]

  const handleLike = (id) => {
    setPosts(
      posts.map((post) => {
        if (post.id === id) {
          const isLiking = !post.liked
          // Trigger animation only when liking (not unliking)
          return { 
            ...post, 
            liked: isLiking, 
            likes: post.liked ? post.likes - 1 : post.likes + 1,
            justLiked: isLiking // Add flag for one-time animation
          }
        }
        return post
      }),
    )
    
    // Remove the justLiked flag after animation completes
    setTimeout(() => {
      setPosts(posts => posts.map(post => 
        post.id === id ? { ...post, justLiked: false } : post
      ))
    }, 600)
  }

  const handlePost = () => {
    if (!newPost.trim()) return

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

    const post = {
      id: posts.length + 1,
      author: currentUser.name || "User",
      username: currentUser.username || "@user",
      role: currentUser.role || "Developer",
      avatar: currentUser.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
      content: newPost,
      image: selectedImage,
      video: selectedVideo,
      timestamp: "Just now",
      likes: 0,
      comments: [],
      liked: false,
    }

    setPosts([post, ...posts])
    setNewPost("")
    setSelectedImage(null)
    setSelectedVideo(null)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddComment = (postId) => {
    if (!commentText.trim()) return

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: post.comments.length + 1,
                  author: "John Doe",
                  username: "@johndoe",
                  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
                  content: commentText,
                  timestamp: "Just now",
                },
              ],
            }
          : post,
      ),
    )
    setCommentText("")
  }

  const handleSharePost = (postId) => {
    const post = posts.find(p => p.id === postId)
    setRepostingPost(post)
  }

  const handleRepost = () => {
    if (!repostingPost) return

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    const repost = {
      id: Date.now(),
      author: currentUser.name || "User",
      username: currentUser.username || "@user",
      role: currentUser.role || "Developer",
      avatar: currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`,
      content: repostMessage,
      repostedContent: {
        author: repostingPost.author,
        username: repostingPost.username,
        avatar: repostingPost.avatar,
        content: repostingPost.content,
        image: repostingPost.image,
        likes: repostingPost.likes,
        comments: repostingPost.comments.length,
      },
      timestamp: "Just now",
      likes: 0,
      comments: [],
      liked: false,
      isRepost: true,
    }

    setPosts([repost, ...posts])
    setRepostMessage("")
    setRepostingPost(null)
  }

  const addEmoji = (emoji) => {
    setNewPost(newPost + emoji)
    setShowEmojiPicker(false)
  }

  const handleViewUser = (user) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    
    // If clicking on own profile, dispatch event to switch to Profile tab
    if (user.username === currentUser.username || user.author === currentUser.name) {
      const event = new CustomEvent('switchTab', { detail: 'profile' })
      window.dispatchEvent(event)
      return
    }
    
    // Navigate to user profile page with state indicating we came from feed
    const username = user.username.replace('@', '')
    navigate(`/user/${username}`, { state: { from: 'feed' } })
  }

  const handleFollow = (username) => {
    if (followedUsers.includes(username)) {
      setFollowedUsers(followedUsers.filter(u => u !== username))
    } else {
      setFollowedUsers([...followedUsers, username])
    }
  }

  const handleMessage = (user) => {
    // Clean username (remove @ if present)
    const cleanUsername = user.username.startsWith('@') 
      ? user.username.substring(1) 
      : user.username

    console.log('📨 Sending openChat event from Feed:', {
      username: cleanUsername,
      name: user.name,
      avatar: user.avatar
    })

    const event = new CustomEvent('openChat', { 
      detail: { 
        username: cleanUsername,
        name: user.name,
        avatar: user.avatar,
        message: "" 
      } 
    })
    window.dispatchEvent(event)
    
    // Close modal
    setShowUserModal(false)
    setSelectedUser(null)
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {/* Create Post - Sticky */}
      <div className="sticky top-0 z-10 bg-neutral-900/95 border-b border-neutral-800 backdrop-blur-sm">
        <div className="flex gap-3 p-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <textarea
              placeholder="What's happening?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="w-full bg-transparent text-lg sm:text-xl text-white placeholder-neutral-500 focus:outline-none resize-none border-none"
              rows={3}
            />

            {selectedImage && (
              <div className="mt-3 relative rounded-2xl overflow-hidden">
                <img src={selectedImage} alt="Upload preview" className="w-full max-h-96 object-cover" />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-neutral-900/90 text-white rounded-full p-2 hover:bg-neutral-800 backdrop-blur-sm"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-800">
              <div className="flex items-center gap-1">
                <label className="cursor-pointer px-3 py-1.5 hover:bg-blue-500/10 text-blue-400 rounded-full transition text-sm font-medium flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden sm:inline">Photo</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <div className="relative emoji-picker-container">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowEmojiPicker(!showEmojiPicker)
                    }}
                    className="px-3 py-1.5 hover:bg-blue-500/10 text-blue-400 rounded-full transition text-sm font-medium flex items-center gap-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="hidden sm:inline">Emoji</span>
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-full mb-3 left-0 bg-neutral-900 border border-neutral-700 rounded-2xl p-4 grid grid-cols-5 gap-3 z-50 shadow-2xl min-w-[280px]">
                      {emojis.map((emoji, idx) => (
                        <button
                          key={idx}
                          onClick={() => addEmoji(emoji)}
                          className="text-2xl hover:bg-neutral-800 rounded-lg p-1 transition"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handlePost}
                disabled={!newPost.trim()}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="bg-neutral-900/50 hover:bg-neutral-900/70 border-b border-neutral-800 transition cursor-pointer"
          >
            <div className="flex gap-3 p-4">
              <img
                src={post.avatar}
                alt={post.author}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full cursor-pointer hover:opacity-80 transition flex-shrink-0"
                onClick={() => handleViewUser(post)}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1 flex-wrap min-w-0">
                    <h3
                      className="text-white font-bold cursor-pointer hover:underline text-sm sm:text-base truncate"
                      onClick={() => handleViewUser(post)}
                    >
                      {post.author}
                    </h3>
                    <span className="text-neutral-500 text-sm truncate">{post.username}</span>
                    <span className="text-neutral-600">·</span>
                    <span className="text-neutral-500 text-sm whitespace-nowrap">{post.timestamp}</span>
                  </div>
                </div>

                <p
                  className="text-white text-base sm:text-lg mt-2 leading-relaxed whitespace-pre-wrap break-words"
                  onClick={() => setSelectedPost(post)}
                >
                  {post.content}
                </p>

                {post.repostedContent && (
                  <div className="mt-3 border border-neutral-700 rounded-xl p-3 bg-neutral-800/30 hover:bg-neutral-800/50 transition">
                    <div className="flex items-center gap-2 mb-2">
                      <img src={post.repostedContent.avatar} alt="" className="w-6 h-6 rounded-full" />
                      <span className="text-neutral-400 text-sm font-medium">{post.repostedContent.author}</span>
                      <span className="text-neutral-600 text-sm">{post.repostedContent.username}</span>
                    </div>
                    <p className="text-neutral-300 text-sm leading-relaxed">{post.repostedContent.content}</p>
                    {post.repostedContent.image && (
                      <img src={post.repostedContent.image} alt="" className="mt-2 rounded-lg max-h-48 object-cover" />
                    )}
                    <div className="flex gap-4 mt-2 text-xs text-neutral-500">
                      <span>❤️ {post.repostedContent.likes}</span>
                      <span>💬 {post.repostedContent.comments}</span>
                    </div>
                  </div>
                )}

                {post.image && !post.repostedContent && (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-neutral-800">
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full max-h-96 object-cover cursor-pointer"
                      onClick={() => setSelectedPost(post)}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between mt-3 max-w-md">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedPost(post)
                    }}
                    className="flex items-center gap-2 group hover:bg-blue-500/10 px-3 py-1.5 rounded-full transition"
                  >
                    <svg className="w-5 h-5 text-neutral-500 group-hover:text-blue-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-neutral-500 group-hover:text-blue-500 text-sm">{post.comments.length}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLike(post.id)
                    }}
                    className={`flex items-center gap-2 group hover:bg-rose-500/10 px-3 py-1.5 rounded-full transition relative`}
                  >
                    <svg 
                      className={`w-5 h-5 transition-all duration-300 ${
                        post.liked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-neutral-500 group-hover:text-rose-500'
                      } ${post.justLiked ? 'animate-ping absolute' : ''}`}
                      fill={post.liked ? 'currentColor' : 'none'} 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {post.justLiked && (
                      <svg 
                        className="w-5 h-5 fill-rose-500 text-rose-500 animate-ping absolute"
                        fill="currentColor" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                    <span className={`text-sm font-medium ${post.liked ? 'text-rose-500' : 'text-neutral-500 group-hover:text-rose-500'}`}>
                      {post.likes}
                    </span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSharePost(post.id)
                    }}
                    className="flex items-center gap-2 group hover:bg-green-500/10 px-3 py-1.5 rounded-full transition"
                  >
                    <svg className="w-5 h-5 text-neutral-500 group-hover:text-green-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-neutral-500 group-hover:text-green-500 text-sm hidden xs:inline">Share</span>
                  </button>
                </div>

                {/* Comments Preview */}
                {post.comments.length > 0 && (
                  <div className="mt-3 space-y-3 pt-3 border-t border-neutral-800">
                    {post.comments.slice(0, 2).map((comment) => (
                      <div key={comment.id} className="flex gap-2">
                        <img src={comment.avatar} alt={comment.author} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-white text-xs sm:text-sm font-bold">{comment.author}</span>
                            <span className="text-neutral-500 text-xs">{comment.username}</span>
                            <span className="text-neutral-600">·</span>
                            <span className="text-neutral-500 text-xs">{comment.timestamp}</span>
                          </div>
                          <p className="text-neutral-300 text-xs sm:text-sm mt-0.5 break-words">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setSelectedPost(null)}>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <img src={selectedPost.avatar} alt={selectedPost.author} className="w-12 h-12 rounded-full" />
                  <div>
                    <h3 className="text-white font-semibold">{selectedPost.author}</h3>
                    <p className="text-neutral-400 text-sm">{selectedPost.username} • {selectedPost.role}</p>
                    <p className="text-neutral-500 text-sm mt-1">{selectedPost.timestamp}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedPost(null)} className="text-neutral-400 hover:text-white text-2xl">
                  ✕
                </button>
              </div>

              <p className="text-white text-lg leading-relaxed mb-4">{selectedPost.content}</p>

              {selectedPost.image && (
                <img src={selectedPost.image} alt="Post" className="rounded-lg w-full mb-6" />
              )}

              <div className="flex items-center gap-6 py-4 border-y border-neutral-800">
                <button
                  onClick={() => handleLike(selectedPost.id)}
                  className={`flex items-center gap-2 ${selectedPost.liked ? 'text-red-500' : 'text-neutral-400'} hover:text-red-500 transition`}
                >
                  <span className="text-xl">{selectedPost.liked ? '❤️' : '🤍'}</span>
                  <span className="text-sm font-medium">{selectedPost.likes} Likes</span>
                </button>
                <div className="flex items-center gap-2 text-neutral-400">
                  <span className="text-xl">�</span>
                  <span className="text-sm font-medium">{selectedPost.comments.length} Comments</span>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-6 space-y-4">
                <h4 className="text-white font-semibold">Comments</h4>
                
                {/* Add Comment */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0" />
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(selectedPost.id)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => handleAddComment(selectedPost.id)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                  >
                    Post
                  </button>
                </div>

                {/* Comments List */}
                {selectedPost.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full" />
                    <div className="flex-1 bg-neutral-800/50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">{comment.author}</span>
                        <span className="text-neutral-500 text-xs">{comment.timestamp}</span>
                      </div>
                      <p className="text-neutral-300 text-sm mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setSelectedUser(null)}>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-neutral-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">User Profile</h2>
                <button onClick={() => setSelectedUser(null)} className="text-neutral-400 hover:text-white text-2xl">
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-6">
                <img src={selectedUser.avatar} alt={selectedUser.name} className="w-24 h-24 rounded-full" />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white">{selectedUser.name}</h3>
                  <p className="text-neutral-400 mt-1">{selectedUser.username}</p>
                  
                  <div className="flex items-center gap-6 mt-4">
                    <div>
                      <p className="text-xl font-bold text-white">{selectedUser.followers}</p>
                      <p className="text-neutral-400 text-sm">Followers</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-white">{selectedUser.following}</p>
                      <p className="text-neutral-400 text-sm">Following</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-white">{selectedUser.posts}</p>
                      <p className="text-neutral-400 text-sm">Posts</p>
                    </div>
                  </div>

                  <p className="text-neutral-300 mt-4">{selectedUser.bio}</p>

                  {selectedUser.location && (
                    <div className="flex items-center gap-2 mt-3 text-neutral-400">
                      <span>📍</span>
                      <span>{selectedUser.location}</span>
                    </div>
                  )}

                  <div className="mt-4">
                    <h4 className="text-white font-semibold mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => handleFollow(selectedUser.username)}
                      className={`px-6 py-2 rounded-lg transition font-medium ${
                        followedUsers.includes(selectedUser.username)
                          ? 'bg-neutral-800 hover:bg-neutral-700 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {followedUsers.includes(selectedUser.username) ? 'Following' : 'Follow'}
                    </button>
                    <button 
                      onClick={() => handleMessage(selectedUser)}
                      className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition font-medium"
                    >
                      Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Repost Modal */}
      {repostingPost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6" onClick={() => setRepostingPost(null)}>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6 border-b border-neutral-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Repost</h2>
                <button onClick={() => setRepostingPost(null)} className="text-neutral-400 hover:text-white text-2xl">
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <textarea
                value={repostMessage}
                onChange={(e) => setRepostMessage(e.target.value)}
                placeholder="Add your thoughts (optional)..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 resize-none mb-4"
                rows={3}
              />

              {/* Original Post Preview */}
              <div className="border border-neutral-700 rounded-lg p-3 sm:p-4 bg-neutral-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <img src={repostingPost.avatar} alt="" className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="text-white font-semibold text-sm">{repostingPost.author}</p>
                    <p className="text-neutral-400 text-xs">{repostingPost.username}</p>
                  </div>
                </div>
                <p className="text-neutral-300 text-sm leading-relaxed">{repostingPost.content}</p>
                {repostingPost.image && (
                  <img src={repostingPost.image} alt="" className="mt-2 rounded-lg max-h-48 object-cover w-full" />
                )}
              </div>

              <div className="flex gap-3 mt-4 justify-end">
                <button
                  onClick={() => setRepostingPost(null)}
                  className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRepost}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition font-medium"
                >
                  Repost
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
