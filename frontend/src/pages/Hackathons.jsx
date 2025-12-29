import Navbar from '@/components/Navbar'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Hackathons() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('explore')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock hackathons data
  const [hackathons] = useState([
    {
      id: 1,
      name: "AI Innovation Challenge 2025",
      tagline: "Build the future with AI",
      coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
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
      rounds: 4
    },
    {
      id: 2,
      name: "Web3 Builder Fest",
      tagline: "Decentralize everything",
      coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
      category: "Blockchain",
      mode: "Hybrid",
      startDate: "2025-11-28",
      endDate: "2025-12-10",
      registrationDeadline: "2025-11-23",
      prizePool: "$75,000",
      participants: 890,
      teams: 178,
      status: "Open",
      difficulty: "Hard",
      host: "Web3 Foundation",
      rounds: 5
    },
    {
      id: 3,
      name: "Mobile App Marathon",
      tagline: "Create apps that matter",
      coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
      category: "Mobile",
      mode: "Online",
      startDate: "2025-12-05",
      endDate: "2025-12-20",
      registrationDeadline: "2025-11-30",
      prizePool: "$30,000",
      participants: 650,
      teams: 130,
      status: "Upcoming",
      difficulty: "Easy",
      host: "AppDev Inc",
      rounds: 3
    },
    {
      id: 4,
      name: "Game Dev Jam 2025",
      tagline: "Create immersive experiences",
      coverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
      category: "Game Dev",
      mode: "Online",
      startDate: "2025-11-22",
      endDate: "2025-12-05",
      registrationDeadline: "2025-11-20",
      prizePool: "$20,000",
      participants: 420,
      teams: 84,
      status: "Ongoing",
      difficulty: "Medium",
      host: "GameDev Studios",
      rounds: 3
    }
  ])

  const categories = ['All', 'AI', 'Web', 'Blockchain', 'Mobile', 'Game Dev', 'Open Innovation']
  const statuses = ['All', 'Open', 'Upcoming', 'Ongoing', 'Completed']

  const filteredHackathons = hackathons.filter(hack => {
    const matchesSearch = hack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hack.tagline.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || hack.category === filterCategory
    const matchesStatus = filterStatus === 'all' || hack.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-black" />
        
        {/* Floating orbs */}
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" style={{ animationDelay: '0s' }} />
        <div className="absolute top-0 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" style={{ animationDelay: '4s' }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        
        {/* Hero Section */}
        <section className="px-6 pt-32 pb-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-8 group hover:border-blue-400/40 transition-all">
              <span className="text-2xl animate-pulse">🏆</span>
              <span className="text-blue-300 text-sm font-medium">Compete • Build • Win</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight max-w-4xl">
              Join Global
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Hackathons
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-slate-400 mb-10 max-w-2xl leading-relaxed">
              Compete with developers worldwide. Build innovative projects. Win amazing prizes.
              Your next breakthrough starts here.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-16">
              <button
                onClick={() => navigate('/hackathons/create')}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Host Hackathon
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => setActiveTab('explore')}
                className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl font-semibold text-white hover:bg-slate-700/50 hover:border-slate-600 transition-all"
              >
                Explore Hackathons
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full">
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 text-center hover:border-blue-500/30 transition-all">
                <div className="text-3xl font-bold text-white mb-2">2,450+</div>
                <div className="text-slate-400 text-sm">Active Hackathons</div>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 text-center hover:border-purple-500/30 transition-all">
                <div className="text-3xl font-bold text-white mb-2">125K+</div>
                <div className="text-slate-400 text-sm">Participants</div>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 text-center hover:border-pink-500/30 transition-all">
                <div className="text-3xl font-bold text-white mb-2">$2.5M+</div>
                <div className="text-slate-400 text-sm">Prize Pool</div>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 text-center hover:border-blue-500/30 transition-all">
                <div className="text-3xl font-bold text-white mb-2">98%</div>
                <div className="text-slate-400 text-sm">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs & Filters */}
        <section className="px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Tabs */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => setActiveTab('explore')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'explore'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                🔍 Explore All
              </button>
              <button
                onClick={() => setActiveTab('my-hackathons')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'my-hackathons'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                👤 My Hackathons
              </button>
              <button
                onClick={() => setActiveTab('hosting')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'hosting'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                🎯 Hosting
              </button>
            </div>

            {/* Search & Filters */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search hackathons..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status.toLowerCase()}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Hackathon Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHackathons.map(hackathon => (
                <HackathonCard key={hackathon.id} hackathon={hackathon} navigate={navigate} />
              ))}
            </div>

            {/* Empty State */}
            {filteredHackathons.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">No hackathons found</h3>
                <p className="text-slate-400 mb-6">Try adjusting your filters or search query</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setFilterCategory('all')
                    setFilterStatus('all')
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

// Hackathon Card Component
function HackathonCard({ hackathon, navigate }) {
  const statusColors = {
    Open: 'bg-green-500/20 text-green-400 border-green-500/30',
    Upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Ongoing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Completed: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  }

  const difficultyColors = {
    Easy: 'text-green-400',
    Medium: 'text-yellow-400',
    Hard: 'text-red-400'
  }

  return (
    <div
      onClick={() => navigate(`/hackathons/${hackathon.id}`)}
      className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all cursor-pointer hover:transform hover:scale-[1.02]"
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={hackathon.coverImage}
          alt={hackathon.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        
        {/* Status Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${statusColors[hackathon.status]}`}>
          {hackathon.status}
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-slate-900/80 text-slate-300 border border-slate-700/50 backdrop-blur-sm">
          {hackathon.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {hackathon.name}
        </h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {hackathon.tagline}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{hackathon.participants} participants</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{hackathon.rounds} rounds</span>
          </div>
        </div>

        {/* Prize & Difficulty */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
          <div>
            <div className="text-xs text-slate-500 mb-1">Prize Pool</div>
            <div className="text-lg font-bold text-white">{hackathon.prizePool}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-1">Difficulty</div>
            <div className={`text-sm font-semibold ${difficultyColors[hackathon.difficulty]}`}>
              {hackathon.difficulty}
            </div>
          </div>
        </div>

        {/* Host */}
        <div className="mt-4 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {hackathon.host[0]}
          </div>
          <span className="text-xs text-slate-400">Hosted by {hackathon.host}</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-6 pb-6">
        <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all group-hover:shadow-lg group-hover:shadow-blue-500/25">
          View Details →
        </button>
      </div>
    </div>
  )
}
