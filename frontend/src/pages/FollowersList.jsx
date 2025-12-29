import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function FollowersList() {
  const navigate = useNavigate()
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])

  useEffect(() => {
    const savedFollowers = JSON.parse(localStorage.getItem('followers') || '[]')
    const savedFollowing = JSON.parse(localStorage.getItem('following') || '[]')
    setFollowers(savedFollowers)
    setFollowing(savedFollowing)
  }, [])

  const handleViewProfile = (user) => {
    const username = user.username.replace('@', '')
    navigate(`/user/${username}`, { state: { from: 'profile' } })
  }

  const handleBack = () => {
    // Go back directly to dashboard profile tab
    navigate('/dashboard/profile')
  }

  const handleFollowBack = (user) => {
    const currentFollowing = JSON.parse(localStorage.getItem('following') || '[]')
    const isAlreadyFollowing = currentFollowing.some(u => u.username === user.username)

    if (isAlreadyFollowing) {
      // Unfollow
      const updated = currentFollowing.filter(u => u.username !== user.username)
      localStorage.setItem('following', JSON.stringify(updated))
      setFollowing(updated)
    } else {
      // Follow back
      currentFollowing.push({
        id: user.id || Date.now(),
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
      })
      localStorage.setItem('following', JSON.stringify(currentFollowing))
      setFollowing(currentFollowing)
    }
  }

  const isFollowingUser = (username) => {
    return following.some(u => u.username === username)
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

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={handleBack}
              className="mb-2 text-blue-400 hover:text-blue-300 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Profile
            </button>
            <h1 className="text-3xl font-bold text-white">Followers</h1>
            <p className="text-neutral-400">{followers.length} followers</p>
          </div>
        </div>

        {/* Followers List */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden backdrop-blur-sm">
          {followers.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>No followers yet</p>
              <p className="text-sm mt-2">When people follow you, they'll appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-800">
              {followers.map((follower) => (
                <div key={follower.id} className="p-4 hover:bg-neutral-800/30 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={follower.avatar}
                        alt={follower.name}
                        className="w-14 h-14 rounded-full ring-2 ring-neutral-700"
                      />
                      <div>
                        <h3 className="text-white font-semibold text-lg">{follower.name}</h3>
                        <p className="text-neutral-400 text-sm">{follower.username}</p>
                        {follower.role && (
                          <p className="text-neutral-500 text-sm">{follower.role}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewProfile(follower)}
                        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleFollowBack(follower)}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          isFollowingUser(follower.username)
                            ? "bg-neutral-800 text-white hover:bg-neutral-700"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        {isFollowingUser(follower.username) ? "Following" : "Follow Back"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
