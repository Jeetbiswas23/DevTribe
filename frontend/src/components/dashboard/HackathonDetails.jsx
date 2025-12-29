import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function HackathonDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hackathon, setHackathon] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joinType, setJoinType] = useState('solo') // solo or team
  const [hasJoined, setHasJoined] = useState(false)

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
    
    // Check if user has joined this hackathon
    const userJoined = JSON.parse(localStorage.getItem('user_hackathons') || '[]')
    const joined = userJoined.find(h => h.hackathonId === id)
    setHasJoined(!!joined)
    
    // Mock data - replace with API call
    const mockHackathon = {
      id: 1,
      name: "AI Innovation Challenge 2025",
      tagline: "Build the future with AI",
      coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200",
      description: "Join the most exciting AI hackathon of the year! Build innovative AI solutions that solve real-world problems. Whether you're a beginner or an expert, this is your chance to showcase your skills and win amazing prizes.",
      category: "AI",
      mode: "Online",
      startDate: "2025-12-01",
      endDate: "2025-12-15",
      registrationDeadline: "2025-11-25",
      prizePool: "$50,000",
      participants: 1240,
      teams: 310,
      status: "Open",
      difficulty: "Medium",
      host: "Tech Corp",
      hostLogo: "T",
      minTeamSize: 1,
      maxTeamSize: 4,
      rules: "1. All code must be written during the hackathon\n2. Use of AI tools is allowed\n3. Projects must be open source\n4. Respect code of conduct",
      prizes: [
        { place: "1st", amount: "$25,000", description: "Grand Prize + Mentorship" },
        { place: "2nd", amount: "$15,000", description: "Runner Up Prize" },
        { place: "3rd", amount: "$10,000", description: "Third Place Prize" }
      ],
      rounds: [
        {
          id: 1,
          type: "MCQ",
          name: "Technical Screening",
          description: "Test your AI fundamentals with 30 multiple choice questions",
          startDate: "2025-12-01",
          endDate: "2025-12-02",
          status: "Upcoming"
        },
        {
          id: 2,
          type: "Coding",
          name: "Coding Challenge",
          description: "Solve 3 algorithmic problems related to AI/ML",
          startDate: "2025-12-03",
          endDate: "2025-12-05",
          status: "Locked"
        },
        {
          id: 3,
          type: "Project",
          name: "Final Project",
          description: "Build and deploy your AI solution",
          startDate: "2025-12-06",
          endDate: "2025-12-14",
          status: "Locked"
        }
      ],
      schedule: [
        { date: "Dec 1", event: "Registration Opens" },
        { date: "Dec 1-2", event: "MCQ Round" },
        { date: "Dec 3-5", event: "Coding Challenge" },
        { date: "Dec 6-14", event: "Project Building Phase" },
        { date: "Dec 15", event: "Results & Awards" }
      ],
      contactEmail: "hello@techcorp.com",
      discordLink: "https://discord.gg/techcorp",
      judges: [
        { name: "Dr. Sarah Chen", role: "AI Research Lead at Google", avatar: "S" },
        { name: "Mark Johnson", role: "CTO at OpenAI", avatar: "M" },
        { name: "Lisa Kumar", role: "VP Engineering at Microsoft", avatar: "L" }
      ]
    }
    setHackathon(mockHackathon)
  }, [id])

  const handleJoin = (type) => {
    setJoinType(type)
    setShowJoinModal(true)
  }

  const confirmJoin = () => {
    // Save join info to localStorage
    const userJoined = JSON.parse(localStorage.getItem('user_hackathons') || '[]')
    userJoined.push({
      hackathonId: id,
      joinType,
      joinedAt: new Date().toISOString(),
      registered: true
    })
    localStorage.setItem('user_hackathons', JSON.stringify(userJoined))
    setShowJoinModal(false)
    
    // Show success message and update rounds status
    alert(`Successfully joined the hackathon ${joinType === 'solo' ? 'solo' : 'with team'}! You can now access the rounds.`)
    
    // Refresh the page to show updated rounds
    window.location.reload()
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/hackathons')}
        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-4"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Hackathons
      </button>

      {/* Hero Section with Cover */}
      <div className="relative h-64 rounded-2xl overflow-hidden">
        <img
          src={hackathon.coverImage}
          alt={hackathon.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/70 to-transparent" />
        
        {/* Status Badge */}
        <div className={`absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-md ${
          hackathon.status === 'Open' ? 'bg-green-500/20 text-green-300 border-green-500/40' :
          hackathon.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
          'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
        }`}>
          {hackathon.status}
        </div>

        {/* Title & Info */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="px-3 py-1 bg-neutral-900/80 backdrop-blur-sm border border-neutral-700/50 rounded-full text-sm text-neutral-300">
              {hackathon.category}
            </div>
            <div className="px-3 py-1 bg-neutral-900/80 backdrop-blur-sm border border-neutral-700/50 rounded-full text-sm text-neutral-300">
              {hackathon.mode}
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{hackathon.name}</h1>
          <p className="text-lg text-neutral-300">{hackathon.tagline}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
          <div className="text-neutral-400 text-sm mb-1">Prize Pool</div>
          <div className="text-2xl font-bold text-green-400">{hackathon.prizePool}</div>
        </div>
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
          <div className="text-neutral-400 text-sm mb-1">Participants</div>
          <div className="text-2xl font-bold text-white">{hackathon.participants}</div>
        </div>
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
          <div className="text-neutral-400 text-sm mb-1">Teams</div>
          <div className="text-2xl font-bold text-white">{hackathon.teams}</div>
        </div>
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
          <div className="text-neutral-400 text-sm mb-1">Rounds</div>
          <div className="text-2xl font-bold text-white">{hackathon.rounds.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        {['overview', 'rounds', 'schedule', 'prizes', 'rules'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl font-medium capitalize transition-all ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-neutral-800/50 text-neutral-400 hover:text-white hover:bg-neutral-700/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">About This Hackathon</h2>
              <p className="text-neutral-300 leading-relaxed whitespace-pre-line mb-6">{hackathon.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-800/30 rounded-xl p-4">
                  <div className="text-neutral-400 text-sm mb-1">Team Size</div>
                  <div className="text-white font-semibold">{hackathon.minTeamSize} - {hackathon.maxTeamSize} members</div>
                </div>
                <div className="bg-neutral-800/30 rounded-xl p-4">
                  <div className="text-neutral-400 text-sm mb-1">Difficulty</div>
                  <div className="text-white font-semibold">{hackathon.difficulty}</div>
                </div>
                <div className="bg-neutral-800/30 rounded-xl p-4">
                  <div className="text-neutral-400 text-sm mb-1">Duration</div>
                  <div className="text-white font-semibold">{hackathon.startDate} - {hackathon.endDate}</div>
                </div>
                <div className="bg-neutral-800/30 rounded-xl p-4">
                  <div className="text-neutral-400 text-sm mb-1">Registration Ends</div>
                  <div className="text-white font-semibold">{hackathon.registrationDeadline}</div>
                </div>
              </div>
            </div>
          )}

          {/* Rounds Tab */}
          {activeTab === 'rounds' && (
            <div className="space-y-4">
              {hackathon.rounds.map((round, index) => (
                <div key={round.id} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getRoundIcon(round.type)}</span>
                        <h3 className="text-xl font-bold text-white">{round.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          round.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          round.status === 'Locked' ? 'bg-neutral-500/20 text-neutral-400 border border-neutral-500/30' :
                          'bg-green-500/20 text-green-300 border border-green-500/30'
                        }`}>
                          {round.status}
                        </span>
                      </div>
                      <p className="text-neutral-400 mb-4">{round.description}</p>
                      <div className="flex items-center gap-4 text-sm text-neutral-400 mb-4">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{round.startDate} - {round.endDate}</span>
                        </div>
                      </div>
                      {!hasJoined ? (
                        <div className="flex items-center gap-2 text-yellow-500 text-sm bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span>Join the hackathon to unlock rounds</span>
                        </div>
                      ) : round.type === 'MCQ' && round.status === 'Upcoming' ? (
                        <button
                          onClick={() => navigate(`/hackathons/${id}/rounds/${round.id}/mcq`)}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all"
                        >
                          Start MCQ Round
                        </button>
                      ) : round.type === 'Coding' && round.status === 'Upcoming' ? (
                        <button
                          onClick={() => navigate(`/hackathons/${id}/rounds/${round.id}/coding`)}
                          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all"
                        >
                          Start Coding Challenge
                        </button>
                      ) : round.status === 'Locked' ? (
                        <div className="flex items-center gap-2 text-neutral-500 text-sm">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span>Complete previous round to unlock</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Event Schedule</h2>
              <div className="space-y-4">
                {hackathon.schedule.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-24 flex-shrink-0">
                      <div className="text-blue-400 font-semibold">{item.date}</div>
                    </div>
                    <div className="flex-1">
                      <div className="h-full border-l-2 border-neutral-700 pl-6 pb-6">
                        <div className="text-white font-medium">{item.event}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prizes Tab */}
          {activeTab === 'prizes' && (
            <div className="space-y-4">
              {hackathon.prizes.map((prize, index) => (
                <div key={index} className={`bg-gradient-to-r ${
                  index === 0 ? 'from-yellow-500/10 to-yellow-600/10 border-yellow-500/30' :
                  index === 1 ? 'from-neutral-500/10 to-neutral-600/10 border-neutral-500/30' :
                  'from-orange-500/10 to-orange-600/10 border-orange-500/30'
                } border rounded-2xl p-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl mb-2">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
                      <h3 className="text-2xl font-bold text-white mb-2">{prize.place} Place</h3>
                      <p className="text-neutral-400">{prize.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-4xl font-bold ${
                        index === 0 ? 'text-yellow-400' :
                        index === 1 ? 'text-neutral-300' :
                        'text-orange-400'
                      }`}>
                        {prize.amount}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Rules & Guidelines</h2>
              <div className="text-neutral-300 whitespace-pre-line leading-relaxed">
                {hackathon.rules}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Join CTA */}
          {!hasJoined ? (
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Ready to Join?</h3>
              <p className="text-blue-100 text-sm mb-6">Choose how you want to participate</p>
              <div className="space-y-3">
                <button
                  onClick={() => handleJoin('solo')}
                  className="w-full py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all"
                >
                  Join Solo
                </button>
                <button
                  onClick={() => handleJoin('team')}
                  className="w-full py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  Join with Team
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="text-xl font-bold">You're Registered!</h3>
              </div>
              <p className="text-green-100 text-sm mb-4">You're all set. Check the Rounds tab to start challenges.</p>
              <button
                onClick={() => setActiveTab('rounds')}
                className="w-full py-3 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all"
              >
                View Rounds
              </button>
            </div>
          )}

          {/* Host Info */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Hosted By</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                {hackathon.hostLogo}
              </div>
              <div>
                <div className="text-white font-semibold">{hackathon.host}</div>
                <div className="text-neutral-400 text-sm">Verified Organizer</div>
              </div>
            </div>
          </div>

          {/* Judges Panel */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Judges Panel</h3>
            <div className="space-y-4">
              {hackathon.judges.map((judge, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {judge.avatar}
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{judge.name}</div>
                    <div className="text-neutral-400 text-xs">{judge.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-4">
              Join {joinType === 'solo' ? 'Solo' : 'with Team'}
            </h3>
            <p className="text-neutral-400 mb-6">
              {joinType === 'solo' 
                ? "You'll participate individually in this hackathon. You can still collaborate with others during the project phase."
                : "You'll need to create or join a team. Team invites will be available in your dashboard."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmJoin}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all"
              >
                Confirm Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getRoundIcon(type) {
  const icons = {
    'MCQ': '📝',
    'Coding': '💻',
    'Submission': '📤',
    'Project': '🚀',
    'Interview': '🎤'
  }
  return icons[type] || '📋'
}
