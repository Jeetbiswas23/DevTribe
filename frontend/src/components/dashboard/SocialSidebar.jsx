import { useState, useEffect } from "react"
import { useSocket } from "../../context/SocketContext"
import { useAuth } from "../../context/AuthContext"
import { userAPI } from "../../api"
import { useNavigate } from "react-router-dom"

export default function SocialSidebar() {
  const { onlineUsers } = useSocket()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [onlineUsersList, setOnlineUsersList] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch suggested users and online users info
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch suggestions
        const suggestionsRes = await userAPI.getSuggestions()
        setSuggestedUsers(suggestionsRes.data.suggestions)

        // Fetch details for online users if we have IDs
        if (onlineUsers.length > 0) {
          // We would typically have an endpoint to get multiple users by ID
          // For now, we might need to rely on what we can get or list all users and filter
          // Optimized approach: fetch only if we don't have them
          // Assuming userAPI.getAll or similar can filter by IDs, or we fetch all relevant users
          // simplified: fetch random/suggested + friends first? 
          // Actually, let's just use the `userAPI.getAll` with a limit, or if we had a `getByIds` endpoint
          // For this implementation, I will assume we can get online users via `getAll` or similar if needed, 
          // OR, since `onlineUsers` mainly gives IDs, we might want to query backend for these IDs.
          // BUT, to keep it simple and given existing APIs:
          // Let's create a temporary solution: 
          // We will use the `suggestedUsers` and maybe others we know.
          // Ideally, the backend `online_users` event *could* send user details, but it sends IDs.
          // let's fetch all users for now to filter (less efficient but works for small scale)
          const allUsersRes = await userAPI.getAll({ limit: 100 }) // Fetching 100 users to match against online IDs
          const allUsers = allUsersRes.data.users

          const onlineDetails = allUsers.filter(u => onlineUsers.includes(u._id) && u._id !== user?._id)
          setOnlineUsersList(onlineDetails)
        } else {
          setOnlineUsersList([])
        }

      } catch (error) {
        console.error("Failed to fetch sidebar data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [onlineUsers, user]) // Re-run when online users change

  const handleFollow = async (username) => {
    try {
      await userAPI.follow(username)
      // Update local state
      setSuggestedUsers(prev => prev.filter(u => u.username !== username))
      // Refetch to get new suggestion? 
      const suggestionsRes = await userAPI.getSuggestions()
      setSuggestedUsers(suggestionsRes.data.suggestions)
    } catch (error) {
      console.error("Failed to follow user:", error)
    }
  }

  return (
    <div className="hidden md:block w-64 lg:w-80 bg-neutral-900/50 border-l border-neutral-800 p-4 lg:p-6 overflow-y-auto h-[calc(100vh-64px)] fixed right-0 top-16">
      <div className="space-y-6">
        {/* Online Users */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm lg:text-base flex items-center gap-2">
            <span className="text-green-500">●</span> Online ({onlineUsersList.length})
          </h3>
          <div className="space-y-3">
            {onlineUsersList.length === 0 ? (
              <p className="text-neutral-500 text-xs">No one is online right now.</p>
            ) : (
              onlineUsersList.map((onlineUser) => (
                <div key={onlineUser._id} className="flex items-start gap-2 lg:gap-3 group cursor-pointer" onClick={() => navigate(`/user/${onlineUser.username}`)}>
                  <div className="relative flex-shrink-0">
                    <img
                      src={onlineUser.avatar}
                      alt={onlineUser.name}
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full ring-2 ring-neutral-800 group-hover:ring-blue-500 transition object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-2 h-2 lg:w-3 lg:h-3 bg-green-500 border-2 border-neutral-900 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="text-white text-xs lg:text-sm font-medium group-hover:text-blue-400 transition break-words">{onlineUser.name}</p>
                    <p className="text-neutral-500 text-xs break-words">{onlineUser.role || "Developer"}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Suggested for You */}
        <div className="border-t border-neutral-800 pt-6">
          <h3 className="text-white font-semibold mb-4 text-sm lg:text-base flex items-center gap-2">
            <span>✨</span> Suggested for you
          </h3>
          <div className="space-y-3">
            {suggestedUsers.length === 0 ? (
              <p className="text-neutral-500 text-xs">No suggestions available.</p>
            ) : (
              suggestedUsers.map((suggestion) => (
                <div key={suggestion._id} className="flex items-start gap-2 lg:gap-3 p-2 rounded-lg hover:bg-neutral-800/50 transition group">
                  <div className="relative flex-shrink-0 cursor-pointer" onClick={() => navigate(`/user/${suggestion.username}`)}>
                    <img
                      src={suggestion.avatar}
                      alt={suggestion.name}
                      className="w-10 h-10 lg:w-12 lg:h-12 rounded-full ring-2 ring-neutral-800 group-hover:ring-purple-500 transition object-cover"
                    />
                    {onlineUsers.includes(suggestion._id) && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-green-500 border-2 border-neutral-900 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden cursor-pointer" onClick={() => navigate(`/user/${suggestion.username}`)}>
                    <p className="text-white text-xs lg:text-sm font-semibold group-hover:text-purple-400 transition break-words">{suggestion.name}</p>
                    <p className="text-neutral-500 text-xs break-words">{suggestion.role || "Developer"}</p>
                  </div>
                  <button
                    onClick={() => handleFollow(suggestion.username)}
                    className="flex-shrink-0 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Follow
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
