import { useState, useEffect } from "react"
import { useNavigate, useLocation, Outlet } from "react-router-dom"
import NavbarTop from '../components/dashboard/NavbarTop'
import SocialSidebar from '../components/dashboard/SocialSidebar'
import NotificationAlert from '../components/NotificationAlert'

export default function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isAuthed, setIsAuthed] = useState(false)
  const [activeAlerts, setActiveAlerts] = useState([])
  const [userType, setUserType] = useState('user')

  // Determine active tab from current route
  const getActiveTab = () => {
    const path = location.pathname.split('/')[2] || 'feed'
    return path
  }

  const activeTab = getActiveTab()

  // Initialize notifications in localStorage
  useEffect(() => {
    if (!localStorage.getItem('notifications')) {
      localStorage.setItem('notifications', JSON.stringify([]))
    }
    if (!localStorage.getItem('teamRequests')) {
      localStorage.setItem('teamRequests', JSON.stringify([]))
    }
  }, [])

  // Listen for new notifications
  useEffect(() => {
    const handleNewNotification = (event) => {
      const notification = event.detail

      // Add to notifications list
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
      notifications.unshift({
        ...notification,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false
      })
      localStorage.setItem('notifications', JSON.stringify(notifications))

      // Show alert popup
      const alert = { ...notification, id: Date.now() }
      setActiveAlerts(prev => [...prev, alert])
    }

    window.addEventListener('newNotification', handleNewNotification)
    return () => window.removeEventListener('newNotification', handleNewNotification)
  }, [])

  const removeAlert = (id) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem("user")
    if (!userData) {
      navigate("/auth")
    } else {
      const user = JSON.parse(userData)
      setUserType(user.userType || 'user')
      setIsAuthed(true)

      // Check for pending chat from navigation
      const pendingChat = localStorage.getItem('pendingChat')
      if (pendingChat) {
        console.log('📨 Found pending chat in localStorage:', pendingChat)
        navigate('/dashboard/chat', {
          state: { pendingChatUser: JSON.parse(pendingChat) }
        })
        // Clear the pending chat
        localStorage.removeItem('pendingChat')
      }
    }
  }, [navigate])

  // Listen for chat navigation from Tribe Apply and tab switching
  useEffect(() => {
    const handleOpenChat = (event) => {
      console.log('🎯 Dashboard received openChat event:', event.detail)
      // Navigate to chat with state
      navigate('/dashboard/chat', {
        state: { pendingChatUser: event.detail }
      })
    }

    const handleSwitchTab = (event) => {
      console.log('📑 Dashboard received switchTab event:', event.detail)
      // Navigate to the requested tab
      navigate(`/dashboard/${event.detail}`)
    }

    window.addEventListener('openChat', handleOpenChat)
    window.addEventListener('switchTab', handleSwitchTab)
    return () => {
      window.removeEventListener('openChat', handleOpenChat)
      window.removeEventListener('switchTab', handleSwitchTab)
    }
  }, [navigate])

  if (!isAuthed) {
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background Grid */}
      <div className="fixed inset-0 z-0">
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Subtle Glow */}
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Fixed Top Navbar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <NavbarTop activeTab={activeTab} />
        </div>

        <main className="flex-1 flex pt-16">
          {/* Main Content Area - Left aligned with right margin for sidebar */}
          <div className="flex-1 px-4 py-6 md:mr-64 lg:mr-80 overflow-y-auto min-h-screen">
            <div className="max-w-6xl">
              <Outlet />
            </div>
          </div>

          <SocialSidebar />
        </main>
      </div>

      {/* Notification Alerts */}
      <div className="fixed top-0 right-0 z-50 flex flex-col gap-2">
        {activeAlerts.map((alert, index) => (
          <div key={alert.id} style={{ marginTop: `${index * 100}px` }}>
            <NotificationAlert
              notification={alert}
              onClose={() => removeAlert(alert.id)}
            />
          </div>
        ))}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-lg border-t border-neutral-800">
        <nav className="flex items-center justify-around px-2 py-3">
          {[
            { id: "feed", label: "Feed", icon: "📰", path: "/dashboard/feed", roles: ["user", "judge", "hr"] },
            { id: "tribe", label: "Tribe", icon: "👥", path: "/dashboard/tribe", roles: ["user", "judge", "hr"] },
            { id: "hackathons", label: "Hackathons", icon: "🏆", path: "/dashboard/hackathons", roles: ["user", "judge", "hr"] },
            { id: "chat", label: "Chat", icon: "💬", path: "/dashboard/chat", roles: ["user", "judge", "hr"] },
            { id: "profile", label: "Profile", icon: "🧑‍💻", path: "/dashboard/profile", roles: ["user", "judge", "hr"] },
            { id: "judge", label: "Judge", icon: "⚖️", path: "/dashboard/judge", roles: ["judge"] },
            { id: "hr", label: "HR", icon: "💼", path: "/dashboard/hr", roles: ["hr"] },
          ]
            .filter(item => item.roles.includes(userType))
            .slice(0, 5) // Show max 5 items on mobile (we include Hackathons in the main set)
            .map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${activeTab === item.id
                  ? "text-blue-400"
                  : "text-neutral-400"
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
        </nav>
      </div>
    </div>
  )
}
