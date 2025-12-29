import { useState, useEffect } from 'react'

export default function NotificationAlert({ notification, onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade out animation
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const getIcon = (type) => {
    switch (type) {
      case 'team_request':
        return '👥'
      case 'follow':
        return '👤'
      case 'like':
        return '❤️'
      case 'comment':
        return '💬'
      case 'team_accepted':
        return '🎉'
      default:
        return '🔔'
    }
  }

  return (
    <div
      className={`fixed top-20 right-6 z-[9999] transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="bg-black text-white border border-neutral-800 rounded-lg shadow-lg p-4 w-80">
        <div className="flex items-start gap-3">
          <div className="text-3xl flex-shrink-0">{getIcon(notification.type)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm mb-1">{notification.title}</p>
            <p className="text-neutral-400 text-xs">{notification.message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
