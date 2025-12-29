import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const HRDashboard = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [activeTab, setActiveTab] = useState('discover') // discover, saved, analytics
  const [selectedHackathon, setSelectedHackathon] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    skills: [],
    experience: 'all',
    availability: 'all'
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user || user.userType !== 'hr') {
      navigate('/auth')
      return
    }
    setUserData(user)
  }, [navigate])

  // Mock data for active hackathons
  const activeHackathons = [
    { id: 'all', name: 'All Hackathons', participants: 567 },
    { id: 1, name: 'AI Innovation Challenge 2024', participants: 156 },
    { id: 2, name: 'Web3 Build Fest', participants: 89 },
    { id: 3, name: 'Green Tech Hackathon', participants: 234 },
  ]

  // Mock candidates data
  const candidates = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Full Stack Developer',
      skills: ['React', 'Node.js', 'Python', 'AWS'],
      experience: '3 years',
      hackathon: 'AI Innovation Challenge 2024',
      score: 38,
      projects: 5,
      linkedin: 'https://linkedin.com/in/alexj',
      github: 'https://github.com/alexj',
      email: 'alex@example.com',
      availability: 'Immediate',
      saved: false
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'ML Engineer',
      skills: ['TensorFlow', 'Python', 'Docker', 'Kubernetes'],
      experience: '5 years',
      hackathon: 'AI Innovation Challenge 2024',
      score: 40,
      projects: 8,
      linkedin: 'https://linkedin.com/in/sarach',
      github: 'https://github.com/sarach',
      email: 'sarah@example.com',
      availability: '2 weeks',
      saved: true
    },
    {
      id: 3,
      name: 'Mike Rodriguez',
      role: 'Frontend Developer',
      skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
      experience: '2 years',
      hackathon: 'Web3 Build Fest',
      score: 35,
      projects: 4,
      linkedin: 'https://linkedin.com/in/miker',
      github: 'https://github.com/miker',
      email: 'mike@example.com',
      availability: '1 month',
      saved: false
    },
  ]

  const [savedCandidates, setSavedCandidates] = useState(
    candidates.filter(c => c.saved)
  )

  const handleSaveCandidate = (candidateId) => {
    const candidate = candidates.find(c => c.id === candidateId)
    if (savedCandidates.find(c => c.id === candidateId)) {
      setSavedCandidates(savedCandidates.filter(c => c.id !== candidateId))
    } else {
      setSavedCandidates([...savedCandidates, candidate])
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/auth')
  }

  const filteredCandidates = candidates.filter(candidate => {
    if (selectedHackathon !== 'all' && candidate.hackathon !== activeHackathons.find(h => h.id === selectedHackathon)?.name) {
      return false
    }
    if (searchQuery && !candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !candidate.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false
    }
    return true
  })

  if (!userData) return null

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">💼</span>
                <span>HR Portal</span>
              </h1>
              <p className="text-slate-400 mt-1">{userData.company} • {userData.position}</p>
            </div>
            <div className="flex items-center gap-4">
              {userData.verified ? (
                <span className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified Recruiter
                </span>
              ) : (
                <span className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400 text-sm font-medium">
                  Verification Pending
                </span>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Total Candidates</p>
              <p className="text-2xl font-bold text-white mt-1">567</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Saved Profiles</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">{savedCandidates.length}</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Active Hackathons</p>
              <p className="text-2xl font-bold text-white mt-1">3</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Interviews Scheduled</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">12</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-700/50">
          <button
            onClick={() => setActiveTab('discover')}
            className={`pb-3 px-4 font-medium transition border-b-2 ${
              activeTab === 'discover'
                ? 'text-purple-400 border-purple-400'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            🔍 Discover Talent
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 px-4 font-medium transition border-b-2 ${
              activeTab === 'saved'
                ? 'text-purple-400 border-purple-400'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            ⭐ Saved ({savedCandidates.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 px-4 font-medium transition border-b-2 ${
              activeTab === 'analytics'
                ? 'text-purple-400 border-purple-400'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            📊 Analytics
          </button>
        </div>

        {activeTab === 'discover' && (
          <>
            {/* Search and Filters */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white mb-2">Search Candidates</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or skills..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Filter by Hackathon</label>
                  <select
                    value={selectedHackathon}
                    onChange={(e) => setSelectedHackathon(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  >
                    {activeHackathons.map(h => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Candidates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCandidates.map(candidate => (
                <div
                  key={candidate.id}
                  className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 hover:border-purple-500/50 transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{candidate.name}</h3>
                      <p className="text-slate-400">{candidate.role}</p>
                    </div>
                    <button
                      onClick={() => handleSaveCandidate(candidate.id)}
                      className={`p-2 rounded-lg transition ${
                        savedCandidates.find(c => c.id === candidate.id)
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      <svg className="w-5 h-5" fill={savedCandidates.find(c => c.id === candidate.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Experience:</span>
                      <span className="text-white font-medium">{candidate.experience}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Hackathon Score:</span>
                      <span className="text-purple-400 font-bold">{candidate.score}/40</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Projects:</span>
                      <span className="text-white font-medium">{candidate.projects}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Availability:</span>
                      <span className={`font-medium ${
                        candidate.availability === 'Immediate' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {candidate.availability}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-slate-400 text-sm mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-purple-300 text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={candidate.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg transition text-sm font-medium"
                    >
                      LinkedIn
                    </a>
                    <a
                      href={candidate.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-center py-2 rounded-lg transition text-sm font-medium"
                    >
                      GitHub
                    </a>
                    <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition text-sm font-medium">
                      Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'saved' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedCandidates.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-slate-400 text-lg">No saved candidates yet</p>
                <p className="text-slate-500 text-sm mt-2">Start discovering talent to save profiles</p>
              </div>
            ) : (
              savedCandidates.map(candidate => (
                <div
                  key={candidate.id}
                  className="bg-slate-900/50 border border-purple-500/50 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{candidate.name}</h3>
                      <p className="text-slate-400">{candidate.role}</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400 text-sm">
                      ⭐ Saved
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Email:</span>
                      <a href={`mailto:${candidate.email}`} className="text-purple-400 hover:text-purple-300">
                        {candidate.email}
                      </a>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Experience:</span>
                      <span className="text-white font-medium">{candidate.experience}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Score:</span>
                      <span className="text-purple-400 font-bold">{candidate.score}/40</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-slate-400 text-sm mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-purple-300 text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition text-sm font-medium">
                      Schedule Interview
                    </button>
                    <button
                      onClick={() => handleSaveCandidate(candidate.id)}
                      className="px-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Top Performers */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🏆</span>
                Top Performers This Month
              </h3>
              <div className="space-y-3">
                {candidates.sort((a, b) => b.score - a.score).slice(0, 5).map((candidate, index) => (
                  <div key={candidate.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        index === 1 ? 'bg-slate-400/20 text-slate-400' :
                        index === 2 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-slate-700 text-slate-400'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-white font-medium">{candidate.name}</p>
                        <p className="text-slate-400 text-sm">{candidate.role}</p>
                      </div>
                    </div>
                    <span className="text-purple-400 font-bold">{candidate.score}/40</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6">
                <p className="text-slate-400 text-sm mb-2">Profile Views</p>
                <p className="text-3xl font-bold text-white">1,234</p>
                <p className="text-green-400 text-sm mt-1">↑ 12% from last month</p>
              </div>
              <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6">
                <p className="text-slate-400 text-sm mb-2">Contact Rate</p>
                <p className="text-3xl font-bold text-white">23%</p>
                <p className="text-green-400 text-sm mt-1">↑ 5% from last month</p>
              </div>
              <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6">
                <p className="text-slate-400 text-sm mb-2">Response Rate</p>
                <p className="text-3xl font-bold text-white">87%</p>
                <p className="text-green-400 text-sm mt-1">↑ 3% from last month</p>
              </div>
            </div>

            {/* Skills Distribution */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Most In-Demand Skills</h3>
              <div className="space-y-3">
                {['React', 'Python', 'Node.js', 'TypeScript', 'AWS'].map((skill, index) => (
                  <div key={skill}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white">{skill}</span>
                      <span className="text-slate-400 text-sm">{100 - index * 15}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${100 - index * 15}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HRDashboard
