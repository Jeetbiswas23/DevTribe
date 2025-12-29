import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Notifications() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'follow',
      user: { name: 'Sarah Chen', username: '@sarahchen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
      message: 'started following you',
      timestamp: '5m ago',
      read: false
    },
    {
      id: 2,
      type: 'like',
      user: { name: 'Mike Johnson', username: '@mikej', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
      message: 'liked your post',
      postPreview: 'Just launched our new AI-powered hackathon matching...',
      timestamp: '1h ago',
      read: false
    },
    {
      id: 3,
      type: 'comment',
      user: { name: 'Alex Chen', username: '@alexchen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
      message: 'commented on your post',
      commentPreview: 'This is amazing! Would love to collaborate...',
      timestamp: '2h ago',
      read: true
    },
    {
      id: 4,
      type: 'team_request',
      user: { name: 'Lisa Park', username: '@lisapark', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa' },
      message: 'invited you to join',
      teamName: 'React Masters',
      timestamp: '3h ago',
      read: true
    },
    {
      id: 5,
      type: 'mention',
      user: { name: 'Tom Davis', username: '@tomd', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom' },
      message: 'mentioned you in a comment',
      commentPreview: '@you Check out this amazing project!',
      timestamp: '5h ago',
      read: true
    },
    {
      id: 6,
      type: 'message',
      user: { name: 'Emma Wilson', username: '@emmaw', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
      message: 'sent you a message',
      messagePreview: 'Hey! Are you free for a quick call?',
      timestamp: '1d ago',
      read: true
    }
  ])

  const [filter, setFilter] = useState('all') // all, unread, mentions, teams

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const getIcon = (type) => {
    switch(type) {
      case 'follow':
        return (
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )
      case 'like':
        return (
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        )
      case 'comment':
        return (
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        )
      case 'team_request':
        return (
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        )
      case 'mention':
        return (
          <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
        )
      case 'message':
        return (
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.read
    if (filter === 'mentions') return n.type === 'mention'
    if (filter === 'teams') return n.type === 'team_request'
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard/feed')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Feed
          </button>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-neutral-400 mt-1">
                  You have <span className="text-blue-400 font-semibold">{unreadCount}</span> unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition font-medium text-sm border border-blue-500/30"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All', count: notifications.length },
              { value: 'unread', label: 'Unread', count: unreadCount },
              { value: 'mentions', label: 'Mentions', count: notifications.filter(n => n.type === 'mention').length },
              { value: 'teams', label: 'Teams', count: notifications.filter(n => n.type === 'team_request').length }
            ].map(({ value, label, count }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  filter === value
                    ? 'bg-blue-500 text-white'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {label} {count > 0 && <span className="opacity-60">({count})</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔔</div>
              <p className="text-neutral-400 text-lg">No notifications here!</p>
              <p className="text-neutral-500 text-sm mt-2">You're all caught up</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`group relative flex gap-4 p-4 rounded-xl border transition-all hover:border-blue-500/50 ${
                  notification.read
                    ? 'bg-neutral-900/50 border-neutral-800'
                    : 'bg-blue-500/5 border-blue-500/30'
                }`}
              >
                {/* Unread indicator */}
                {!notification.read && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-blue-500 rounded-r-full"></div>
                )}

                {/* Icon */}
                <div className="flex-shrink-0">
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <img 
                          src={notification.user.avatar} 
                          alt={notification.user.name}
                          className="w-6 h-6 rounded-full ring-2 ring-neutral-800"
                        />
                        <span className="font-semibold text-white">{notification.user.name}</span>
                        <span className="text-neutral-400">{notification.message}</span>
                      </div>

                      {/* Preview content */}
                      {notification.postPreview && (
                        <p className="text-sm text-neutral-400 mt-2 pl-8 italic">"{notification.postPreview}"</p>
                      )}
                      {notification.commentPreview && (
                        <p className="text-sm text-neutral-300 mt-2 pl-8 bg-neutral-800/50 p-2 rounded-lg border-l-2 border-blue-500">
                          {notification.commentPreview}
                        </p>
                      )}
                      {notification.messagePreview && (
                        <p className="text-sm text-neutral-300 mt-2 pl-8 bg-neutral-800/50 p-2 rounded-lg">
                          💬 {notification.messagePreview}
                        </p>
                      )}
                      {notification.teamName && (
                        <p className="text-sm text-purple-400 mt-2 pl-8 font-semibold">
                          Team: {notification.teamName}
                        </p>
                      )}

                      <p className="text-xs text-neutral-500 mt-2 pl-8">{notification.timestamp}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition"
                          title="Mark as read"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
