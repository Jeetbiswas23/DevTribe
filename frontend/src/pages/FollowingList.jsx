import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function FollowingList() {
  const navigate = useNavigate()
  const [following, setFollowing] = useState([])

  useEffect(() => {
    const savedFollowing = JSON.parse(localStorage.getItem('following') || '[]')
    setFollowing(savedFollowing)
  }, [])

  const handleBack = () => {
    // Go back directly to dashboard profile tab
    navigate('/dashboard/profile')
  }

  const handleUnfollow = (user) => {
    const updated = following.filter(u => u.username !== user.username)
    localStorage.setItem('following', JSON.stringify(updated))
    setFollowing(updated)
  }

  const handleViewProfile = (user) => {
    const username = user.username.replace('@', '')
    navigate(`/user/${username}`, { state: { from: 'profile' } })
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
            <h1 className="text-3xl font-bold text-white">Following</h1>
            <p className="text-neutral-400">{following.length} following</p>
          </div>
        </div>

        {/* Following List */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden backdrop-blur-sm">
          {following.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>Not following anyone yet</p>
              <p className="text-sm mt-2">Discover and follow people to see their updates</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-800">
              {following.map((user) => (
                <div key={user.id} className="p-4 hover:bg-neutral-800/30 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-14 h-14 rounded-full ring-2 ring-neutral-700"
                      />
                      <div>
                        <h3 className="text-white font-semibold text-lg">{user.name}</h3>
                        <p className="text-neutral-400 text-sm">{user.username}</p>
                        {user.role && (
                          <p className="text-neutral-500 text-sm">{user.role}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewProfile(user)}
                        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleUnfollow(user)}
                        className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 rounded-lg font-medium transition"
                      >
                        Unfollow
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
