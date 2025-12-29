import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '@/components/Navbar'

export default function HackathonDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hackathon, setHackathon] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joinType, setJoinType] = useState('solo') // solo or team

  useEffect(() => {
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
      joinedAt: new Date().toISOString()
    })
    localStorage.setItem('user_hackathons', JSON.stringify(userJoined))
    setShowJoinModal(false)
    navigate(`/hackathons/${id}/dashboard`)
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      {/* Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-black" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        {/* Hero Section with Cover */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={hackathon.coverImage}
            alt={hackathon.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
          
          {/* Status Badge */}
          <div className={`absolute top-24 right-6 px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-md ${
            hackathon.status === 'Open' ? 'bg-green-500/20 text-green-300 border-green-500/40' :
            hackathon.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
            'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
          }`}>
            {hackathon.status}
          </div>

          {/* Title & Info */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-full text-sm text-slate-300">
                  {hackathon.category}
                </div>
                <div className="px-3 py-1 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-full text-sm text-slate-300">
                  {hackathon.mode}
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{hackathon.name}</h1>
              <p className="text-xl text-slate-300 mb-6">{hackathon.tagline}</p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{hackathon.startDate} - {hackathon.endDate}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{hackathon.participants} participants</span>
                </div>
                <div className="flex items-center gap-2 text-green-400 font-semibold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{hackathon.prizePool} Prize Pool</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <div className="flex flex-wrap gap-3 mb-6">
                {['overview', 'rounds', 'schedule', 'prizes', 'rules'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 rounded-xl font-medium capitalize transition-all ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">About This Hackathon</h2>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">{hackathon.description}</p>
                  
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/30 rounded-xl p-4">
                      <div className="text-slate-400 text-sm mb-1">Team Size</div>
                      <div className="text-white font-semibold">{hackathon.minTeamSize} - {hackathon.maxTeamSize} members</div>
                    </div>
                    <div className="bg-slate-800/30 rounded-xl p-4">
                      <div className="text-slate-400 text-sm mb-1">Difficulty</div>
                      <div className="text-white font-semibold">{hackathon.difficulty}</div>
                    </div>
                    <div className="bg-slate-800/30 rounded-xl p-4">
                      <div className="text-slate-400 text-sm mb-1">Total Rounds</div>
                      <div className="text-white font-semibold">{hackathon.rounds.length} rounds</div>
                    </div>
                    <div className="bg-slate-800/30 rounded-xl p-4">
                      <div className="text-slate-400 text-sm mb-1">Registration Ends</div>
                      <div className="text-white font-semibold">{hackathon.registrationDeadline}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rounds Tab */}
              {activeTab === 'rounds' && (
                <div className="space-y-4">
                  {hackathon.rounds.map((round, index) => (
                    <div key={round.id} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{getRoundIcon(round.type)}</span>
                            <h3 className="text-xl font-bold text-white">{round.name}</h3>
                          </div>
                          <p className="text-slate-400">{round.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          round.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          round.status === 'Locked' ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30' :
                          'bg-green-500/20 text-green-300 border border-green-500/30'
                        }`}>
                          {round.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{round.startDate} - {round.endDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Schedule Tab */}
              {activeTab === 'schedule' && (
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Event Schedule</h2>
                  <div className="space-y-4">
                    {hackathon.schedule.map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-24 flex-shrink-0">
                          <div className="text-blue-400 font-semibold">{item.date}</div>
                        </div>
                        <div className="flex-1">
                          <div className="h-full border-l-2 border-slate-700 pl-6 pb-6">
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
                      index === 1 ? 'from-slate-500/10 to-slate-600/10 border-slate-500/30' :
                      'from-orange-500/10 to-orange-600/10 border-orange-500/30'
                    } border backdrop-blur-sm rounded-2xl p-8`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-3xl mb-2">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
                          <h3 className="text-2xl font-bold text-white mb-2">{prize.place} Place</h3>
                          <p className="text-slate-400">{prize.description}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-4xl font-bold ${
                            index === 0 ? 'text-yellow-400' :
                            index === 1 ? 'text-slate-300' :
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
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Rules & Guidelines</h2>
                  <div className="text-slate-300 whitespace-pre-line leading-relaxed">
                    {hackathon.rules}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Join CTA */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Ready to Join?</h3>
                <p className="text-blue-100 text-sm mb-6">Choose how you want to participate in this hackathon</p>
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

              {/* Host Info */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Hosted By</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                    {hackathon.hostLogo}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{hackathon.host}</div>
                    <div className="text-slate-400 text-sm">Verified Organizer</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {hackathon.contactEmail && (
                    <a href={`mailto:${hackathon.contactEmail}`} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{hackathon.contactEmail}</span>
                    </a>
                  )}
                  {hackathon.discordLink && (
                    <a href={hackathon.discordLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
                      <span>💬</span>
                      <span>Join Discord</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Judges Panel */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Judges Panel</h3>
                <div className="space-y-4">
                  {hackathon.judges.map((judge, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {judge.avatar}
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{judge.name}</div>
                        <div className="text-slate-400 text-xs">{judge.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-4">
              Join {joinType === 'solo' ? 'Solo' : 'with Team'}
            </h3>
            <p className="text-slate-400 mb-6">
              {joinType === 'solo' 
                ? "You'll participate individually in this hackathon. You can still collaborate with others during the project phase."
                : "You'll need to create or join a team. Team invites will be available in your dashboard."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all"
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
