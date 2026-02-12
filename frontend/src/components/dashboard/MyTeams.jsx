import { useState, useEffect } from 'react'
import { teamAPI } from '../../api'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function MyTeams() {
  const [myTeams, setMyTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      loadMyTeams()
    }
  }, [user])

  const loadMyTeams = async () => {
    try {
      setLoading(true)
      const response = await teamAPI.getAll()
      const allTeams = response.data.teams

      // Filter teams where current user is the leader
      const userTeams = allTeams.filter(team =>
        team.leader._id === user._id || team.leader.username === user.username
      )

      // Calculate stats (handled by backend usually, but for now client-side calculation if needed)
      // The backend populate should give us what we need

      setMyTeams(userTeams)
    } catch (error) {
      console.error("Failed to load teams:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm("Are you sure you want to delete this team? This action cannot be undone.")) {
      try {
        await teamAPI.delete(teamId)
        // Remove from local state
        setMyTeams(prev => prev.filter(team => team._id !== teamId))
      } catch (error) {
        console.error("Failed to delete team:", error)
        alert("Failed to delete team. Please try again.")
      }
    }
  }

  if (loading) {
    return <div className="text-neutral-500 text-center py-8">Loading teams...</div>
  }

  if (myTeams.length === 0) {
    return (
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-8 text-center">
        <svg className="w-16 h-16 mx-auto mb-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-neutral-500">You haven't created any teams yet</p>
        <p className="text-neutral-600 text-sm mt-2">Go to Hackathons tab to create your first team!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">My Teams</h3>
      {myTeams.map((team) => (
        <div key={team._id} className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h4 className="text-xl font-bold text-white mb-1">{team.name}</h4>
              <p className="text-neutral-400 text-sm mb-2">{team.hackathonName || team.hackathon}</p>
              <p className="text-neutral-300 text-sm">{team.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDeleteTeam(team._id)}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                title="Delete Team"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-neutral-800/50 rounded-lg p-3">
              <div className="text-neutral-400 text-xs mb-1">Team Size</div>
              <div className="text-white font-bold">
                {team.members?.length || 1}/{team.requiredMembers} Members
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                {team.requiredMembers - (team.members?.length || 1)} slots left
              </div>
            </div>

            <div className="bg-neutral-800/50 rounded-lg p-3">
              <div className="text-neutral-400 text-xs mb-1">Pending Requests</div>
              <div className="text-white font-bold text-2xl">
                {team.pendingRequests?.length || 0}
              </div>
              {(team.pendingRequests?.length || 0) > 0 && (
                <div className="text-xs text-blue-400 mt-1 cursor-pointer" onClick={() => navigate('/dashboard/tribe')}>
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
            {(team.members?.length || 1) >= team.requiredMembers ? (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                ✓ Team Full
              </span>
            ) : (
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                ⚠ {team.requiredMembers - (team.members?.length || 1)} Spots Open
              </span>
            )}

            {(team.pendingRequests?.length || 0) > 0 && (
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                {team.pendingRequests?.length} Pending
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
