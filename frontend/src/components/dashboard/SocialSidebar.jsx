import { useState } from "react"

export default function SocialSidebar() {
  const [users, setUsers] = useState([
    { id: 1, name: "Sarah Chen", role: "Full Stack Dev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", isOnline: true, isFollowing: false },
    { id: 2, name: "Mike Johnson", role: "React Expert", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike", isOnline: true, isFollowing: false },
    { id: 3, name: "Emma Wilson", role: "DevOps Engineer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", isOnline: false, isFollowing: false },
    { id: 4, name: "Alex Chen", role: "ML Engineer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", isOnline: true, isFollowing: false },
    { id: 5, name: "Lisa Park", role: "UI/UX Designer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa", isOnline: true, isFollowing: false },
    { id: 6, name: "Tom Davis", role: "Backend Dev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom", isOnline: false, isFollowing: false },
  ])

  const handleFollow = (userId) => {
    const user = users.find(u => u.id === userId)
    const isNowFollowing = !user.isFollowing
    
    setUsers(users.map((u) => (u.id === userId ? { ...u, isFollowing: isNowFollowing } : u)))
    
    // Update following list in localStorage
    const currentFollowing = JSON.parse(localStorage.getItem('following') || '[]')
    if (isNowFollowing) {
      // Add to following
      if (!currentFollowing.find(u => u.id === userId)) {
        currentFollowing.push({ id: userId, name: user.name, role: user.role, avatar: user.avatar })
        localStorage.setItem('following', JSON.stringify(currentFollowing))
      }
    } else {
      // Remove from following
      const updatedFollowing = currentFollowing.filter(u => u.id !== userId)
      localStorage.setItem('following', JSON.stringify(updatedFollowing))
    }
  }

  const onlineUsers = users.filter((u) => u.isOnline)
  const suggestedUsers = users.filter((u) => !u.isFollowing)

  return (
    <div className="hidden md:block w-64 lg:w-80 bg-neutral-900/50 border-l border-neutral-800 p-4 lg:p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Online Users */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm lg:text-base flex items-center gap-2">
            <span className="text-green-500">●</span> Online ({onlineUsers.length})
          </h3>
          <div className="space-y-3">
            {onlineUsers.map((user) => (
              <div key={user.id} className="flex items-start gap-2 lg:gap-3 group">
                <div className="relative flex-shrink-0">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-full ring-2 ring-neutral-800 group-hover:ring-blue-500 transition"
                  />
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2 h-2 lg:w-3 lg:h-3 bg-green-500 border-2 border-neutral-900 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-white text-xs lg:text-sm font-medium group-hover:text-blue-400 transition break-words">{user.name}</p>
                  <p className="text-neutral-500 text-xs break-words">{user.role}</p>
                </div>
                <button
                  onClick={() => handleFollow(user.id)}
                  className={`flex-shrink-0 px-2 lg:px-3 py-1 rounded-lg text-xs font-medium transition ${
                    user.isFollowing
                      ? "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {user.isFollowing ? "✓" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested for You */}
        <div className="border-t border-neutral-800 pt-6">
          <h3 className="text-white font-semibold mb-4 text-sm lg:text-base flex items-center gap-2">
            <span>✨</span> Suggested for you
          </h3>
          <div className="space-y-3">
            {suggestedUsers.slice(0, 4).map((user) => (
              <div key={user.id} className="flex items-start gap-2 lg:gap-3 p-2 rounded-lg hover:bg-neutral-800/50 transition group">
                <div className="relative flex-shrink-0">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full ring-2 ring-neutral-800 group-hover:ring-purple-500 transition"
                  />
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-green-500 border-2 border-neutral-900 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-white text-xs lg:text-sm font-semibold group-hover:text-purple-400 transition break-words">{user.name}</p>
                  <p className="text-neutral-500 text-xs break-words">{user.role}</p>
                </div>
                <button
                  onClick={() => handleFollow(user.id)}
                  className="flex-shrink-0 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition"
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
