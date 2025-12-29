import { useState, useEffect } from 'react'

export default function MyTeams() {
  const [myTeams, setMyTeams] = useState([])
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    loadMyTeams()
  }, [])

  const loadMyTeams = () => {
    const allTeams = JSON.parse(localStorage.getItem('teams') || '[]')
    const teamRequests = JSON.parse(localStorage.getItem('teamRequests') || '[]')
    
    // Filter teams created by current user
    const userTeams = allTeams.filter(team => {
      const creatorUsername = team.creator.username.replace('@', '')
      const currentUsername = currentUser.username.replace('@', '')
      return creatorUsername === currentUsername
    })

    // Add request counts to teams
    const teamsWithRequests = userTeams.map(team => {
      const pendingRequests = teamRequests.filter(req => 
        req.teamId === team.id && req.status === 'pending'
      )
      const acceptedRequests = teamRequests.filter(req =>
        req.teamId === team.id && req.status === 'accepted'
      )
      
      return {
        ...team,
        pendingCount: pendingRequests.length,
        acceptedCount: acceptedRequests.length,
        totalMembers: 1 + acceptedRequests.length // Creator + accepted members
      }
    })

    setMyTeams(teamsWithRequests)
  }

  if (myTeams.length === 0) {
    return (
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-8 text-center">
        <svg className="w-16 h-16 mx-auto mb-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-neutral-500">You haven't created any teams yet</p>
        <p className="text-neutral-600 text-sm mt-2">Go to Tribe tab to create your first team!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">My Teams</h3>
      {myTeams.map((team) => (
        <div key={team.id} className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h4 className="text-xl font-bold text-white mb-1">{team.name}</h4>
              <p className="text-neutral-400 text-sm mb-2">{team.hackathon}</p>
              <p className="text-neutral-300 text-sm">{team.project}</p>
            </div>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-neutral-800/50 rounded-lg p-3">
              <div className="text-neutral-400 text-xs mb-1">Team Size</div>
              <div className="text-white font-bold">
                {team.totalMembers}/{team.maxMembers} Members
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                {team.maxMembers - team.totalMembers} slots left
              </div>
            </div>

            <div className="bg-neutral-800/50 rounded-lg p-3">
              <div className="text-neutral-400 text-xs mb-1">Pending Requests</div>
              <div className="text-white font-bold text-2xl">
                {team.pendingCount}
              </div>
              {team.pendingCount > 0 && (
                <div className="text-xs text-blue-400 mt-1">
                  Review in Team Requests
                </div>
              )}
            </div>
          </div>

          {/* Tech Stack */}
          {team.tech && team.tech.length > 0 && (
            <div className="mb-4">
              <div className="text-neutral-400 text-xs mb-2">Tech Stack</div>
              <div className="flex flex-wrap gap-2">
                {team.tech.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Status Indicators */}
          <div className="flex items-center gap-3 pt-3 border-t border-neutral-800">
            {team.totalMembers >= team.maxMembers ? (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                ✓ Team Full
              </span>
            ) : (
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                ⚠ {team.maxMembers - team.totalMembers} Spots Open
              </span>
            )}
            
            {team.pendingCount > 0 && (
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                {team.pendingCount} Pending
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
