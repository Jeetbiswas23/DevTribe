import { useState, useEffect } from 'react'

export default function TeamRequests() {
  const [requests, setRequests] = useState([])
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = () => {
    const allRequests = JSON.parse(localStorage.getItem('teamRequests') || '[]')
    // Filter requests for teams created by current user
    const myRequests = allRequests.filter(req => 
      req.teamLeader.username === currentUser.username.replace('@', '') && 
      req.status === 'pending'
    )
    setRequests(myRequests)
  }

  const handleAccept = (request) => {
    // Update request status
    const allRequests = JSON.parse(localStorage.getItem('teamRequests') || '[]')
    const updatedRequests = allRequests.map(req =>
      req.id === request.id ? { ...req, status: 'accepted' } : req
    )
    localStorage.setItem('teamRequests', JSON.stringify(updatedRequests))

    // Update team member count
    const allTeams = JSON.parse(localStorage.getItem('teams') || '[]')
    const updatedTeams = allTeams.map(team => {
      if (team.id === request.teamId) {
        const acceptedMembers = team.acceptedMembers || []
        return {
          ...team,
          members: team.members + 1,
          acceptedMembers: [...acceptedMembers, {
            username: request.applicant.username,
            name: request.applicant.name,
            avatar: request.applicant.avatar,
            acceptedAt: new Date().toISOString()
          }]
        }
      }
      return team
    })
    localStorage.setItem('teams', JSON.stringify(updatedTeams))

    // Create group chat
    createGroupChat(request)

    // Send notification to applicant
    const notificationEvent = new CustomEvent('newNotification', {
      detail: {
        type: 'team_accepted',
        title: 'Team Request Accepted!',
        message: `You've been accepted to join "${request.teamName}"!`
      }
    })
    window.dispatchEvent(notificationEvent)

    loadRequests()
  }

  const handleDecline = (request) => {
    const allRequests = JSON.parse(localStorage.getItem('teamRequests') || '[]')
    const updatedRequests = allRequests.map(req =>
      req.id === request.id ? { ...req, status: 'declined' } : req
    )
    localStorage.setItem('teamRequests', JSON.stringify(updatedRequests))
    loadRequests()
  }

  const createGroupChat = (request) => {
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]')
    
    // Check if group chat already exists
    const existingGroup = conversations.find(conv => 
      conv.isGroup && conv.teamId === request.teamId
    )

    if (!existingGroup) {
      const groupConvId = `group_${request.teamId}_${Date.now()}`
      const groupConversation = {
        id: groupConvId,
        isGroup: true,
        teamId: request.teamId,
        name: request.teamName,
        participants: [currentUser.username.replace('@', ''), request.applicant.username.replace('@', '')],
        members: [
          {
            username: currentUser.username.replace('@', ''),
            name: currentUser.name,
            avatar: currentUser.avatar,
            role: 'leader'
          },
          {
            username: request.applicant.username.replace('@', ''),
            name: request.applicant.name,
            avatar: request.applicant.avatar,
            role: 'member'
          }
        ],
        channels: [
          { id: 'general', name: 'General', icon: '💬' },
          { id: 'work-updates', name: 'Work Updates', icon: '📊' },
          { id: 'chill', name: 'Chill', icon: '🎮' },
          { id: 'code-reviews', name: 'Code Reviews', icon: '👨‍💻' },
          { id: 'resources', name: 'Resources', icon: '📚' }
        ],
        activeChannel: 'general',
        messages: {},
        createdAt: new Date().toISOString()
      }

      // Initialize messages for each channel
      groupConversation.channels.forEach(channel => {
        groupConversation.messages[channel.id] = [
          {
            id: Date.now(),
            sender: 'system',
            text: `Welcome to ${channel.name}!`,
            timestamp: new Date().toISOString()
          }
        ]
      })

      conversations.push(groupConversation)
      localStorage.setItem('conversations', JSON.stringify(conversations))
    }
  }

  if (requests.length === 0) {
    return (
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-8 text-center">
        <svg className="w-16 h-16 mx-auto mb-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-neutral-500">No pending team requests</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Team Requests</h3>
      {requests.map((request) => (
        <div key={request.id} className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              {request.applicant.avatar ? (
                <img src={request.applicant.avatar} alt={request.applicant.name} className="w-full h-full rounded-full" />
              ) : (
                <span className="text-white font-bold text-lg">
                  {request.applicant.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold">{request.applicant.name}</h4>
              <p className="text-neutral-400 text-sm">{request.applicant.username}</p>
              <p className="text-white mt-2">
                Wants to join <span className="font-bold text-blue-400">{request.teamName}</span>
              </p>
              <div className="mt-2 text-sm text-neutral-500">
                <p>🏆 {request.hackathon}</p>
                <p>💡 {request.project}</p>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleAccept(request)}
                  className="p-2.5 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white border border-green-500/50 hover:border-green-500 rounded-lg font-medium transition-all group"
                  title="Accept"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDecline(request)}
                  className="p-2.5 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/50 hover:border-red-500 rounded-lg font-medium transition-all group"
                  title="Decline"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
