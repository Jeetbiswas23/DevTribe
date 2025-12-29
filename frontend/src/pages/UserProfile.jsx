import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"

export default function UserProfile() {
  const { username } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [userInfo, setUserInfo] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [mutualFollowers, setMutualFollowers] = useState([])
  const [activeTab, setActiveTab] = useState("posts")
  const [userPosts, setUserPosts] = useState([])

  // Get the source tab from navigation state
  const fromTab = location.state?.from || 'feed'

  const handleBack = () => {
    // Navigate directly to the source tab without going through dashboard
    navigate(`/dashboard/${fromTab}`)
  }

  useEffect(() => {
    // Load user data based on username
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    const allPosts = JSON.parse(localStorage.getItem('posts') || '[]')
    const following = JSON.parse(localStorage.getItem('following') || '[]')
    
    // Check if viewing own profile
    if (username === currentUser.username) {
      navigate('/dashboard')
      return
    }

    // Find user in following list or posts
    let foundUser = following.find(u => u.username === `@${username}` || u.username === username)
    
    if (!foundUser) {
      // Try to find from posts
      const userPost = allPosts.find(p => p.username === `@${username}` || p.username === username)
      if (userPost) {
        foundUser = {
          name: userPost.author,
          username: userPost.username,
          avatar: userPost.avatar,
          role: userPost.role,
        }
      }
    }

    if (foundUser) {
      setUserInfo({
        ...foundUser,
        bio: "Passionate developer building amazing products",
        location: "San Francisco, CA",
        website: "https://johndoe.dev",
        dateOfBirth: "1995-06-15",
        skills: ["React", "JavaScript", "Node.js"],
        interests: ["Web3", "AI/ML", "DevOps"],
        followers: Math.floor(Math.random() * 1000),
        following: Math.floor(Math.random() * 500),
        joinDate: "Joined recently",
      })

      // Check if following
      setIsFollowing(following.some(u => u.username === foundUser.username))

      // Get user's posts
      const posts = allPosts.filter(p => p.username === foundUser.username)
      setUserPosts(posts)

      // Calculate mutual followers (mock for now)
      setMutualFollowers([])
    }
  }, [username, navigate])

  const handleFollow = () => {
    const following = JSON.parse(localStorage.getItem('following') || '[]')
    
    if (isFollowing) {
      // Unfollow
      const updated = following.filter(u => u.username !== userInfo.username)
      localStorage.setItem('following', JSON.stringify(updated))
      setIsFollowing(false)
    } else {
      // Follow
      following.push({
        id: Date.now(),
        name: userInfo.name,
        username: userInfo.username,
        avatar: userInfo.avatar,
        role: userInfo.role,
      })
      localStorage.setItem('following', JSON.stringify(following))
      setIsFollowing(true)
    }
  }

  const handleMessage = () => {
    // Clean username (remove @ if present)
    const cleanUsername = userInfo.username.startsWith('@') 
      ? userInfo.username.substring(1) 
      : userInfo.username

    console.log('📨 UserProfile storing pending chat:', {
      username: cleanUsername,
      name: userInfo.name,
      avatar: userInfo.avatar
    })

    // Store chat data in localStorage for Dashboard to pick up
    const chatData = {
      username: cleanUsername,
      name: userInfo.name,
      avatar: userInfo.avatar,
      message: ""
    }
    localStorage.setItem('pendingChat', JSON.stringify(chatData))
    
    // Navigate directly to dashboard chat
    navigate('/dashboard/chat')
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-4 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to {fromTab === 'tribe' ? 'Tribe' : 'Feed'}
        </button>

        {/* Profile Card */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden backdrop-blur-sm">
          {/* Banner */}
          <div className="h-48 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>

          <div className="relative px-6 pb-6">
            {/* Profile Picture */}
            <div className="relative -mt-20 mb-4">
              <img
                src={userInfo.avatar}
                alt={userInfo.name}
                className="w-40 h-40 rounded-full border-4 border-neutral-900 bg-neutral-800"
              />
            </div>

            {/* User Info */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{userInfo.name}</h1>
                <p className="text-neutral-400 mb-2">{userInfo.username}</p>
                <p className="text-neutral-300 mb-3">{userInfo.bio}</p>
                
                <div className="flex items-center gap-4 text-sm text-neutral-400 mb-3">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {userInfo.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {userInfo.joinDate}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <span className="text-white">
                    <span className="font-bold">{userInfo.followers}</span>
                    <span className="text-neutral-400 ml-1">Followers</span>
                  </span>
                  <span className="text-white">
                    <span className="font-bold">{userInfo.following}</span>
                    <span className="text-neutral-400 ml-1">Following</span>
                  </span>
                </div>

                {mutualFollowers.length > 0 && (
                  <p className="text-sm text-neutral-400">
                    Followed by {mutualFollowers.length} people you follow
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    isFollowing
                      ? "bg-neutral-800 text-white hover:bg-neutral-700"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
                <button
                  onClick={handleMessage}
                  className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-semibold transition"
                >
                  Message
                </button>
              </div>
            </div>

            {/* Skills & Interests */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-white font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {userInfo.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-lg text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {userInfo.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-lg text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-neutral-800 mb-4">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`pb-3 px-1 font-medium transition ${
                    activeTab === "posts"
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Posts ({userPosts.length})
                </button>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {userPosts.length === 0 ? (
                <div className="text-center py-12 text-neutral-400">
                  No posts yet
                </div>
              ) : (
                userPosts.map((post) => (
                  <div key={post.id} className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
                    <p className="text-white mb-2">{post.content}</p>
                    {post.image && (
                      <img src={post.image} alt="Post" className="rounded-lg mb-2 max-h-96 object-cover" />
                    )}
                    <div className="flex items-center gap-4 text-sm text-neutral-400">
                      <span>{post.likes} likes</span>
                      <span>{post.comments?.length || 0} comments</span>
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
