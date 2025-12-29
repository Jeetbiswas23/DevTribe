import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function NavbarTop({ activeTab }) {
  const navigate = useNavigate()
  const [userName, setUserName] = useState("Developer")
  const [userType, setUserType] = useState("user")
  const [searchQuery, setSearchQuery] = useState("")
  // mobile menu removed in favor of a bottom mobile navigation bar
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setUserName(user.name)
      setUserType(user.userType || 'user')
    }
    
    // Update unread count
    updateUnreadCount()
    
    // Listen for new notifications
    const handleNewNotification = () => {
      updateUnreadCount()
    }
    window.addEventListener('newNotification', handleNewNotification)
    
    // Close notifications when clicking outside
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-panel') && !event.target.closest('.notification-bell')) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      window.removeEventListener('newNotification', handleNewNotification)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  const updateUnreadCount = () => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
    const unread = notifications.filter(n => !n.read).length
    setUnreadCount(unread)
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    if (!showNotifications) {
      // Mark all as read when opening
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
      notifications.forEach(n => n.read = true)
      localStorage.setItem('notifications', JSON.stringify(notifications))
      setUnreadCount(0)
    }
  }

  const navItems = [
    { id: "feed", label: "Feed", path: "/dashboard/feed", roles: ["user", "judge", "hr"] },
    { id: "tribe", label: "Tribe", path: "/dashboard/tribe", roles: ["user", "judge", "hr"] },
    { id: "chat", label: "Chat", path: "/dashboard/chat", roles: ["user", "judge", "hr"] },
    { id: "profile", label: "Profile", path: "/dashboard/profile", roles: ["user", "judge", "hr"] },
    { id: "hackathons", label: "Hackathons", path: "/dashboard/hackathons", roles: ["user", "judge", "hr"] },
    { id: "judge", label: "⚖️ Judging", path: "/dashboard/judge", roles: ["judge"] },
    { id: "hr", label: "💼 HR Portal", path: "/dashboard/hr", roles: ["hr"] },
  ].filter(item => item.roles.includes(userType))

  const handleSignOut = () => {
    localStorage.removeItem("user")
    navigate("/")
  }

  return (
    <div className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-xl px-3 sm:px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">Welcome, {userName}</h1>
          <p className="text-neutral-400 text-xs sm:text-sm hidden sm:block">Here's what's happening in your tribe today</p>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <nav className="flex items-center gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === item.id
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button
              onClick={toggleNotifications}
              className="notification-bell relative p-2 text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-lg transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 w-48 transition"
              />
            </div>

            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Mobile menu button intentionally removed - mobile nav lives in the dashboard bottom bar */}
      </div>

      {/* mobile menu removed - bottom navigation in Dashboard handles mobile routing */}

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="notification-panel fixed top-16 right-6 w-96 max-h-96 overflow-y-auto bg-black border border-neutral-700 rounded-lg shadow-2xl z-[9999]">
          <div className="p-4 border-b border-neutral-800 bg-neutral-900">
            <h3 className="text-white font-bold">Notifications</h3>
          </div>
          {JSON.parse(localStorage.getItem('notifications') || '[]').length === 0 ? (
            <div className="p-8 text-center text-neutral-500 bg-black">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-800 bg-black">
              {JSON.parse(localStorage.getItem('notifications') || '[]').slice(0, 10).map((notif) => (
                <div key={notif.id} className="p-4 hover:bg-neutral-900 transition">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">
                      {notif.type === 'team_request' && '👥'}
                      {notif.type === 'follow' && '👤'}
                      {notif.type === 'like' && '❤️'}
                      {notif.type === 'comment' && '💬'}
                      {notif.type === 'team_accepted' && '🎉'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{notif.title}</p>
                      <p className="text-neutral-400 text-xs mt-1">{notif.message}</p>
                      <p className="text-neutral-600 text-xs mt-1">
                        {new Date(notif.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
