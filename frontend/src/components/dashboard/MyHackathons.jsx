import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MyHackathons() {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const [myHackathons, setMyHackathons] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [hackathonToDelete, setHackathonToDelete] = useState(null)

  const difficultyColors = {
    'Easy': 'text-green-400',
    'Medium': 'text-yellow-400',
    'Hard': 'text-red-400'
  }

  useEffect(() => {
    loadMyHackathons()
  }, [])

  const loadMyHackathons = () => {
    const allHackathons = JSON.parse(localStorage.getItem('hackathons') || '[]')
    const userHackathons = allHackathons.filter(h => h.createdBy === currentUser.username)
    setMyHackathons(userHackathons)
  }

  const handleDelete = (hackathonId) => {
    const allHackathons = JSON.parse(localStorage.getItem('hackathons') || '[]')
    const updatedHackathons = allHackathons.filter(h => h.id !== hackathonId)
    localStorage.setItem('hackathons', JSON.stringify(updatedHackathons))
    
    setMyHackathons(prev => prev.filter(h => h.id !== hackathonId))
    setShowDeleteModal(false)
    setHackathonToDelete(null)
  }

  const getAcceptedJudges = (hackathonId) => {
    const judgeInvitations = JSON.parse(localStorage.getItem('judge_invitations') || '[]')
    return judgeInvitations.filter(inv => 
      inv.hackathonId === hackathonId && inv.status === 'accepted'
    )
  }

  const getPendingJudges = (hackathonId) => {
    const judgeInvitations = JSON.parse(localStorage.getItem('judge_invitations') || '[]')
    return judgeInvitations.filter(inv => 
      inv.hackathonId === hackathonId && inv.status === 'pending'
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Hackathons</h1>
          <p className="text-neutral-400">Manage your created hackathons</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/hackathons/create')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Hackathon
        </button>
      </div>

      {/* Hackathons List */}
      {myHackathons.length === 0 ? (
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Hackathons Yet</h3>
          <p className="text-neutral-400 mb-6">Create your first hackathon and start managing participants!</p>
          <button
            onClick={() => navigate('/dashboard/hackathons/create')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Hackathon
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myHackathons.map((hackathon) => {
            const acceptedJudges = getAcceptedJudges(hackathon.id)
            const pendingJudges = getPendingJudges(hackathon.id)
            const displayImage = hackathon.coverImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'
            
            return (
              <div key={hackathon.id} className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-all">
                <div className="flex flex-col lg:flex-row">
                  {/* Cover Image */}
                  <div className="lg:w-80 h-48 lg:h-auto relative overflow-hidden flex-shrink-0">
                    <img
                      src={displayImage}
                      alt={hackathon.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 to-transparent" />
                    <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-sm font-medium border ${
                      hackathon.status === 'Open' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      hackathon.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                      hackathon.status === 'Ongoing' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-neutral-500/20 text-neutral-400 border-neutral-500/30'
                    }`}>
                      {hackathon.status}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">{hackathon.name}</h3>
                        <p className="text-neutral-400">{hackathon.tagline}</p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                      <div className="bg-neutral-800/50 rounded-lg p-3">
                        <div className="text-xs text-neutral-500 mb-1">Participants</div>
                        <div className="text-xl font-bold text-white">{hackathon.participants || 0}</div>
                      </div>
                      <div className="bg-neutral-800/50 rounded-lg p-3">
                        <div className="text-xs text-neutral-500 mb-1">Teams</div>
                        <div className="text-xl font-bold text-white">{hackathon.teams || 0}</div>
                      </div>
                      <div className="bg-neutral-800/50 rounded-lg p-3">
                        <div className="text-xs text-neutral-500 mb-1">Rounds</div>
                        <div className="text-xl font-bold text-white">
                          {Array.isArray(hackathon.rounds) ? hackathon.rounds.length : hackathon.rounds || 0}
                        </div>
                      </div>
                      <div className="bg-neutral-800/50 rounded-lg p-3">
                        <div className="text-xs text-neutral-500 mb-1">Prize Pool</div>
                        <div className="text-xl font-bold text-green-400">{hackathon.prizePool}</div>
                      </div>
                      <div className="bg-neutral-800/50 rounded-lg p-3">
                        <div className="text-xs text-neutral-500 mb-1">Difficulty</div>
                        <div className={`text-xl font-bold ${difficultyColors[hackathon.difficulty] || 'text-white'}`}>
                          {hackathon.difficulty || 'Medium'}
                        </div>
                      </div>
                    </div>

                    {/* Judge Status */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-neutral-400 mb-3">Judge Invitations</h4>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
                          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-green-400 font-medium">
                            {acceptedJudges.length} Accepted
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-yellow-400 font-medium">
                            {pendingJudges.length} Pending
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => navigate(`/dashboard/hackathons/${hackathon.id}`)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          // Store hackathon data for editing
                          localStorage.setItem('editingHackathon', JSON.stringify(hackathon))
                          navigate(`/dashboard/hackathons/create?edit=${hackathon.id}`)
                        }}
                        className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setHackathonToDelete(hackathon.id)
                          setShowDeleteModal(true)
                        }}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Delete Hackathon</h3>
            </div>
            <p className="text-neutral-400 mb-6">
              Are you sure you want to delete this hackathon? This action cannot be undone and will remove all associated data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setHackathonToDelete(null)
                }}
                className="flex-1 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(hackathonToDelete)}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
