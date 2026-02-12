import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { userAPI, postAPI } from "../../api"
import TeamRequests from "./TeamRequests"
import MyTeams from "./MyTeams"

export default function Profile() {
  const navigate = useNavigate()
  const { user: authUser, checkAuth } = useAuth()

  const [isEditMode, setIsEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")

  // Use authUser if available, otherwise default structure
  const [userInfo, setUserInfo] = useState({
    name: "",
    username: "",
    bio: "",
    location: "",
    website: "",
    dateOfBirth: "",
    skills: [],
    interests: [],
  })

  useEffect(() => {
    if (authUser) {
      setUserInfo({
        name: authUser.name || "",
        username: authUser.username || "",
        bio: authUser.bio || "",
        location: authUser.location || "",
        website: authUser.website || "",
        dateOfBirth: authUser.dateOfBirth ? new Date(authUser.dateOfBirth).toISOString().split('T')[0] : "",
        skills: authUser.skills || [],
        interests: authUser.interests || [],
      })
      setProfileImage(authUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.username}`)
    }
  }, [authUser])

  const [bannerImage, setBannerImage] = useState("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200")
  const [profileImage, setProfileImage] = useState("")

  const [newSkill, setNewSkill] = useState("")
  const [newInterest, setNewInterest] = useState("")
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)
  const [showEditPostModal, setShowEditPostModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [editPostContent, setEditPostContent] = useState("")
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)

  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])

  // Load followers/following from backend
  useEffect(() => {
    const fetchSocials = async () => {
      if (authUser?.username) {
        try {
          const [followersRes, followingRes] = await Promise.all([
            userAPI.getFollowers(authUser.username),
            userAPI.getFollowing(authUser.username)
          ])
          setFollowers(followersRes.data.followers)
          setFollowing(followingRes.data.following)
        } catch (error) {
          console.error("Error loading socials:", error)
        }
      }
    }
    fetchSocials()
  }, [authUser])

  const availableSkills = ["React", "Node.js", "TypeScript", "GraphQL", "Python", "Java", "Docker", "AWS", "MongoDB", "PostgreSQL"]
  const availableInterests = ["Web3", "AI/ML", "DevOps", "Mobile Dev", "Game Dev", "Blockchain", "IoT", "AR/VR"]

  const user = {
    joinDate: authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : "Joined recently",
    followers: followers.length,
    following: following.length,
  }

  // Load real user posts, likes, and comments from backend
  const [myPosts, setMyPosts] = useState([])
  const [myLikes, setMyLikes] = useState([])
  const [myComments, setMyComments] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch all posts and filter (or use a specific endpoint if available)
        // For now, assume getFeed returns mixed posts, we might want user specific posts
        // But since we are reusing existing APIs:
        const response = await postAPI.getFeed()
        const allPosts = response.data.posts

        if (authUser) {
          const userPosts = allPosts.filter(p => p.username === authUser.username)
          setMyPosts(userPosts)

          // Liked posts - this requires us to know which posts the user liked. 
          // If the backend returns `liked: true` for the current user, we can filter.
          const likedPosts = allPosts.filter(p => p.hasLiked) // Assuming 'hasLiked' or checking likes array if it contains user ID
          setMyLikes(likedPosts)

          // Comments... similar logic
          // This might be heavy for frontend filtering but works for MVP
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
      }
    }
    fetchPosts()
  }, [authUser])

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddSkill = (skill) => {
    if (!userInfo.skills.includes(skill)) {
      setUserInfo({ ...userInfo, skills: [...userInfo.skills, skill] })
    }
    setNewSkill("")
  }

  const handleRemoveSkill = (skill) => {
    setUserInfo({ ...userInfo, skills: userInfo.skills.filter(s => s !== skill) })
  }

  const handleAddInterest = (interest) => {
    if (!userInfo.interests.includes(interest)) {
      setUserInfo({ ...userInfo, interests: [...userInfo.interests, interest] })
    }
    setNewInterest("")
  }

  const handleRemoveInterest = (interest) => {
    setUserInfo({ ...userInfo, interests: userInfo.interests.filter(i => i !== interest) })
  }

  const handleSave = async () => {
    try {
      await userAPI.updateProfile(userInfo)
      await checkAuth() // Refresh user data in context
      setShowEditModal(false)
      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile.")
    }
  }

  const handleDeletePost = (post) => {
    setPostToDelete(post)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    const allPosts = JSON.parse(localStorage.getItem('posts') || '[]')
    const updated = allPosts.filter(p => p.id !== postToDelete.id)
    localStorage.setItem('posts', JSON.stringify(updated))
    setMyPosts(myPosts.filter(p => p.id !== postToDelete.id))
    setShowDeleteModal(false)
    setPostToDelete(null)
  }

  const handleEditPost = (post) => {
    setEditingPost(post)
    setEditPostContent(post.content)
    setShowEditPostModal(true)
  }

  const saveEditPost = () => {
    const allPosts = JSON.parse(localStorage.getItem('posts') || '[]')
    const updated = allPosts.map(p =>
      p.id === editingPost.id ? { ...p, content: editPostContent } : p
    )
    localStorage.setItem('posts', JSON.stringify(updated))
    setMyPosts(myPosts.map(p =>
      p.id === editingPost.id ? { ...p, content: editPostContent } : p
    ))
    setShowEditPostModal(false)
    setEditingPost(null)
    setEditPostContent("")
  }

  const handleDeleteComment = (post, comment) => {
    setCommentToDelete({ post, comment })
    setShowDeleteCommentModal(true)
  }

  const confirmDeleteComment = () => {
    const { post, comment } = commentToDelete
    const allPosts = JSON.parse(localStorage.getItem('posts') || '[]')
    const updated = allPosts.map(p => {
      if (p.id === post.id) {
        return {
          ...p,
          comments: p.comments.filter(c => c.id !== comment.id)
        }
      }
      return p
    })
    localStorage.setItem('posts', JSON.stringify(updated))

    // Refresh comments
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    const commented = updated.filter(p =>
      p.comments && p.comments.some(c => c.username === currentUser.username)
    ).map(p => ({
      ...p,
      userComments: p.comments.filter(c => c.username === currentUser.username)
    }))
    setMyComments(commented)
    setShowDeleteCommentModal(false)
    setCommentToDelete(null)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Banner and Profile Section */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden backdrop-blur-sm">
        {/* Banner */}
        <div className="relative h-32 sm:h-48 md:h-64">
          <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
          <label className="absolute top-2 sm:top-4 right-2 sm:right-4 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-neutral-900/80 hover:bg-neutral-800 text-white rounded-lg cursor-pointer transition flex items-center gap-1 sm:gap-2 text-xs sm:text-sm backdrop-blur-sm">
            <span>📷</span>
            <span className="hidden xs:inline">Change Banner</span>
            <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
          </label>
        </div>

        <div className="relative px-4 sm:px-6 md:px-8 pb-4 sm:pb-6">
          {/* Profile Picture */}
          <div className="relative -mt-12 sm:-mt-16 md:-mt-20 mb-4 sm:mb-6">
            <div className="relative inline-block">
              <img
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 sm:border-6 border-neutral-900 bg-neutral-800"
              />
              <label className="absolute bottom-0 right-0 p-1.5 sm:p-2 md:p-3 bg-blue-500 hover:bg-blue-600 rounded-full cursor-pointer transition">
                <span className="text-base sm:text-lg md:text-xl">📷</span>
                <input type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{userInfo.name}</h1>
              <p className="text-neutral-400 text-sm sm:text-base">@{userInfo.username}</p>
              <p className="text-neutral-500 text-xs sm:text-sm mt-1">{user.joinDate}</p>
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6">
              <button
                onClick={() => navigate('/followers')}
                className="text-center hover:opacity-80 transition"
              >
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">{user.followers}</p>
                <p className="text-neutral-400 text-xs sm:text-sm">Followers</p>
              </button>
              <button
                onClick={() => navigate('/following')}
                className="text-center hover:opacity-80 transition"
              >
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">{user.following}</p>
                <p className="text-neutral-400 text-xs sm:text-sm">Following</p>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 sm:mt-6">
            <p className="text-neutral-300 text-sm sm:text-base md:text-lg flex-1">{userInfo.bio}</p>
            <button onClick={() => setShowEditModal(true)} className="ml-3 px-3 sm:px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition flex items-center gap-2 text-xs sm:text-sm flex-shrink-0">
              <span>✏️</span>
              <span className="hidden xs:inline">Edit</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 sm:mt-6 text-neutral-400 text-xs sm:text-sm">
            {userInfo.location && (
              <div className="flex items-center gap-1 sm:gap-2">
                <span>📍</span>
                <span>{userInfo.location}</span>
              </div>
            )}
            {userInfo.website && (
              <div className="flex items-center gap-1 sm:gap-2">
                <span>🔗</span>
                <a href={userInfo.website} className="hover:text-blue-400 transition truncate max-w-[200px]">
                  {userInfo.website}
                </a>
              </div>
            )}
            {userInfo.dateOfBirth && (
              <div className="flex items-center gap-1 sm:gap-2">
                <span>🎂</span>
                <span>{new Date(userInfo.dateOfBirth).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Skills and Interests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {userInfo.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 sm:px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs sm:text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {userInfo.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-2 sm:px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs sm:text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 sm:p-5 md:p-6 backdrop-blur-sm">
        <div className="flex gap-2 sm:gap-4 border-b border-neutral-800 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide">
          {["posts", "likes", "comments", "my-teams", "team-requests"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-4 py-2 rounded-t-lg font-medium transition text-xs sm:text-sm capitalize whitespace-nowrap ${activeTab === tab
                ? "bg-blue-500/20 text-blue-400 border-b-2 border-blue-500"
                : "text-neutral-400 hover:text-neutral-200"
                }`}
            >
              {tab === "team-requests" ? "Team Requests" : tab === "my-teams" ? "My Teams" : tab}
            </button>
          ))}
        </div>

        {activeTab === "posts" && (
          <div className="space-y-3 sm:space-y-4">
            {myPosts.length === 0 ? (
              <div className="text-center py-12 text-neutral-400">
                <p>No posts yet</p>
                <p className="text-sm mt-2">Create your first post in the Feed</p>
              </div>
            ) : (
              myPosts.map((post) => (
                <div key={post.id} className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-3 sm:p-4 hover:border-blue-500/50 transition">
                  <p className="text-white text-sm sm:text-base mb-2">{post.content}</p>
                  {post.image && (
                    <img src={post.image} alt="Post" className="rounded-lg mb-2 max-h-64 object-cover" />
                  )}
                  {post.repostedContent && (
                    <div className="bg-neutral-900/50 border border-neutral-600 rounded-lg p-3 mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <img src={post.repostedContent.avatar} alt="" className="w-6 h-6 rounded-full" />
                        <span className="text-neutral-400 text-xs">{post.repostedContent.author}</span>
                      </div>
                      <p className="text-neutral-300 text-sm">{post.repostedContent.content}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3 text-neutral-400 text-xs sm:text-sm">
                    <div className="flex gap-4">
                      <span>❤️ {post.likes}</span>
                      <span>💬 {post.comments?.length || 0}</span>
                      <span>{post.timestamp}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeletePost(post)}
                        className="text-red-400 hover:text-red-300 transition flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "likes" && (
          <div className="space-y-3 sm:space-y-4">
            {myLikes.length === 0 ? (
              <div className="text-center py-12 text-neutral-400">
                <p>No liked posts yet</p>
                <p className="text-sm mt-2">Like posts to see them here</p>
              </div>
            ) : (
              myLikes.map((post) => (
                <div key={post.id} className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-3 sm:p-4 hover:border-red-500/50 transition">
                  <div className="flex items-center gap-2 mb-2">
                    <img src={post.avatar} alt="" className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="text-white font-medium text-sm">{post.author}</p>
                      <p className="text-neutral-400 text-xs">{post.username}</p>
                    </div>
                  </div>
                  <p className="text-white text-sm sm:text-base mb-2">{post.content}</p>
                  {post.image && (
                    <img src={post.image} alt="Post" className="rounded-lg mb-2 max-h-64 object-cover" />
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-neutral-500 text-xs sm:text-sm">{post.timestamp}</p>
                    <button
                      onClick={() => {
                        const allPosts = JSON.parse(localStorage.getItem('posts') || '[]')
                        const updated = allPosts.map(p =>
                          p.id === post.id ? { ...p, liked: false, likes: p.likes - 1 } : p
                        )
                        localStorage.setItem('posts', JSON.stringify(updated))
                        setMyLikes(myLikes.filter(p => p.id !== post.id))
                      }}
                      className="text-red-400 hover:text-red-300 transition text-xs"
                    >
                      Unlike
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "comments" && (
          <div className="space-y-3 sm:space-y-4">
            {myComments.length === 0 ? (
              <div className="text-center py-12 text-neutral-400">
                <p>No comments yet</p>
                <p className="text-sm mt-2">Comment on posts to see them here</p>
              </div>
            ) : (
              myComments.map((post) => (
                <div key={post.id} className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-3 sm:p-4 hover:border-purple-500/50 transition">
                  <div className="flex items-center gap-2 mb-2">
                    <img src={post.avatar} alt="" className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="text-white font-medium text-sm">{post.author}</p>
                      <p className="text-neutral-400 text-xs">Original post</p>
                    </div>
                  </div>
                  <p className="text-neutral-300 text-sm mb-3">{post.content}</p>
                  <div className="border-t border-neutral-700 pt-3 space-y-2">
                    {post.userComments.map((comment, idx) => (
                      <div key={idx} className="bg-neutral-900/50 rounded-lg p-2">
                        <p className="text-white text-sm">{comment.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-neutral-500 text-xs">{comment.timestamp}</p>
                          <button
                            onClick={() => handleDeleteComment(post, comment)}
                            className="text-red-400 hover:text-red-300 transition text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "my-teams" && (
          <MyTeams />
        )}

        {activeTab === "team-requests" && (
          <TeamRequests />
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Edit Profile</h2>
                  <p className="text-neutral-400 text-sm mt-1">Update your personal information</p>
                </div>
                <button onClick={() => setShowEditModal(false)} className="text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-full p-2 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">Full Name</label>
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">Username</label>
                  <input
                    type="text"
                    value={userInfo.username}
                    onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    placeholder="@johndoe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2 text-sm">Bio</label>
                <textarea
                  value={userInfo.bio}
                  onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition"
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
                <p className="text-neutral-500 text-xs mt-1">{userInfo.bio.length}/160 characters</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-2 text-white font-semibold mb-2 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location
                  </label>
                  <input
                    type="text"
                    value={userInfo.location}
                    onChange={(e) => setUserInfo({ ...userInfo, location: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    placeholder="San Francisco, CA"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-white font-semibold mb-2 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Website
                  </label>
                  <input
                    type="url"
                    value={userInfo.website}
                    onChange={(e) => setUserInfo({ ...userInfo, website: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-white font-semibold mb-2 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={userInfo.dateOfBirth}
                  onChange={(e) => setUserInfo({ ...userInfo, dateOfBirth: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Skills</label>
                <div className="flex gap-2 mb-3">
                  <select
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select a skill</option>
                    {availableSkills.map((skill) => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => newSkill && handleAddSkill(newSkill)}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userInfo.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill}
                      <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-400">✕</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Interests</label>
                <div className="flex gap-2 mb-3">
                  <select
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select an interest</option>
                    {availableInterests.map((interest) => (
                      <option key={interest} value={interest}>{interest}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => newInterest && handleAddInterest(newInterest)}
                    className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userInfo.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-sm flex items-center gap-2"
                    >
                      {interest}
                      <button onClick={() => handleRemoveInterest(interest)} className="hover:text-red-400">✕</button>
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="bg-neutral-900/95 backdrop-blur-sm border-t border-neutral-800 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition font-semibold border border-neutral-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition font-semibold shadow-lg shadow-blue-500/20"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Post Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Delete Post</h3>
                  <p className="text-neutral-400 text-sm mt-1">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-neutral-300 mb-6">
                Are you sure you want to delete this post? This will permanently remove it from your profile and feed.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {showEditPostModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEditPostModal(false)}>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-neutral-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Edit Post</h2>
                <button onClick={() => setShowEditPostModal(false)} className="text-neutral-400 hover:text-white text-2xl">
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <textarea
                value={editPostContent}
                onChange={(e) => setEditPostContent(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 resize-none"
                rows={6}
                placeholder="What's on your mind?"
              />

              <div className="flex gap-3 mt-4 justify-end">
                <button
                  onClick={() => setShowEditPostModal(false)}
                  className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditPost}
                  disabled={!editPostContent.trim()}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Comment Modal */}
      {showDeleteCommentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteCommentModal(false)}>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Delete Comment</h3>
                  <p className="text-neutral-400 text-sm mt-1">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-neutral-300 mb-6">
                Are you sure you want to delete this comment?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteCommentModal(false)}
                  className="flex-1 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteComment}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
