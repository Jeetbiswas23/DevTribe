import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Hackathons() {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState('popular') // popular, prize, recent, ending
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [hackathonToDelete, setHackathonToDelete] = useState(null)

  // Load hackathons from localStorage
  const [hackathons, setHackathons] = useState([
    {
      id: 1,
      name: "AI Innovation Challenge 2025",
      tagline: "Build the future with AI",
      coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      category: "AI",
      mode: "Online",
      startDate: "2025-12-01",
      endDate: "2025-12-15",
      prizePool: "$50,000",
      participants: 1240,
      teams: 310,
      status: "Open",
      difficulty: "Medium",
      host: "Tech Corp",
      rounds: 4,
      featured: true,
      trending: true
    },
    {
      id: 2,
      name: "Web3 Builder Fest",
      tagline: "Decentralize everything",
      coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
      category: "Blockchain",
      mode: "Hybrid",
      startDate: "2025-11-25",
      endDate: "2025-12-10",
      prizePool: "$75,000",
      participants: 890,
      teams: 223,
      status: "Open",
      difficulty: "Hard",
      host: "Blockchain Foundation",
      rounds: 5,
      featured: true
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
      prizePool: "$30,000",
      participants: 650,
      teams: 163,
      status: "Upcoming",
      difficulty: "Easy",
      host: "Mobile Innovations",
      rounds: 3,
      trending: true
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
      prizePool: "$20,000",
      participants: 420,
      teams: 84,
      status: "Ongoing",
      difficulty: "Medium",
      host: "GameDev Studios",
      rounds: 3
    }
  ])

  // Load hackathons from localStorage on mount
  useEffect(() => {
    const savedHackathons = JSON.parse(localStorage.getItem('hackathons') || '[]')
    if (savedHackathons.length > 0) {
      // Merge and remove duplicates based on ID
      setHackathons(prev => {
        const combined = [...savedHackathons, ...prev]
        // Remove duplicates by ID
        const uniqueHackathons = combined.filter((hackathon, index, self) =>
          index === self.findIndex((h) => h.id === hackathon.id)
        )
        return uniqueHackathons
      })
    }
  }, [])

  const handleDeleteHackathon = (hackathonId) => {
    // Remove from state
    setHackathons(prev => prev.filter(h => h.id !== hackathonId))
    
    // Remove from localStorage
    const savedHackathons = JSON.parse(localStorage.getItem('hackathons') || '[]')
    const updatedHackathons = savedHackathons.filter(h => h.id !== hackathonId)
    localStorage.setItem('hackathons', JSON.stringify(updatedHackathons))
    
    setShowDeleteModal(false)
    setHackathonToDelete(null)
  }

  const handleEditHackathon = (hackathonId) => {
    navigate(`/dashboard/hackathons/edit/${hackathonId}`)
  }

  const categories = ['All', 'AI', 'Web', 'Blockchain', 'Mobile', 'Game Dev', 'Open Innovation']
  const statuses = ['All', 'Open', 'Upcoming', 'Ongoing']
  const difficulties = ['All', 'Easy', 'Medium', 'Hard']

  const filteredHackathons = hackathons.filter(hack => {
    const matchesSearch = hack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hack.tagline.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || hack.category === filterCategory
    const matchesStatus = filterStatus === 'all' || hack.status === filterStatus
    const matchesDifficulty = filterDifficulty === 'all' || hack.difficulty === filterDifficulty
    return matchesSearch && matchesCategory && matchesStatus && matchesDifficulty
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.participants - a.participants
    if (sortBy === 'prize') return parseInt(b.prizePool.replace(/\D/g, '')) - parseInt(a.prizePool.replace(/\D/g, ''))
    if (sortBy === 'recent') return new Date(b.startDate) - new Date(a.startDate)
    if (sortBy === 'ending') return new Date(a.endDate) - new Date(b.endDate)
    return 0
  })

  const featuredHackathons = hackathons.filter(h => h.featured)

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Simple Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Hackathons</h1>
          <p className="text-neutral-400">Discover and join exciting coding competitions</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/dashboard/hackathons/my')}
            className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            My Hackathons
          </button>
          <button
            onClick={() => navigate('/dashboard/hackathons/create')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Host Hackathon
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hackathons..."
              className="w-full pl-12 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Category */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2.5 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map(cat => (
                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
              ))}
            </select>

            {/* Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
            >
              <option value="all">All Status</option>
              {statuses.slice(1).map(status => (
                <option key={status} value={status.toLowerCase()}>{status}</option>
              ))}
            </select>

            {/* Difficulty */}
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2.5 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
            >
              <option value="all">All Levels</option>
              {difficulties.slice(1).map(diff => (
                <option key={diff} value={diff.toLowerCase()}>{diff}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
            >
              <option value="popular">Most Popular</option>
              <option value="prize">Highest Prize</option>
              <option value="recent">Recently Added</option>
              <option value="ending">Ending Soon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            {filteredHackathons.length} Hackathons
          </h2>
          {(filterCategory !== 'all' || filterStatus !== 'all' || filterDifficulty !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setFilterCategory('all')
                setFilterStatus('all')
                setFilterDifficulty('all')
                setSearchQuery('')
              }}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Hackathons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHackathons.map((hackathon) => (
            <HackathonCard 
              key={hackathon.id} 
              hackathon={hackathon} 
              navigate={navigate}
              currentUser={currentUser}
            />
          ))}
        </div>

        {filteredHackathons.length === 0 && (
          <div className="text-center py-12 bg-neutral-900/30 border border-neutral-800 rounded-xl">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-white mb-2">No hackathons found</h3>
            <p className="text-neutral-400 text-sm mb-4">Try adjusting your filters</p>
            <button
              onClick={() => {
                setFilterCategory('all')
                setFilterStatus('all')
                setFilterDifficulty('all')
                setSearchQuery('')
              }}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
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
              Are you sure you want to delete this hackathon? This action cannot be undone.
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
                onClick={() => handleDeleteHackathon(hackathonToDelete)}
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

// Clean Hackathon Card Component
function HackathonCard({ hackathon, navigate, currentUser }) {
  const statusColors = {
    Open: 'bg-green-500/20 text-green-400 border-green-500/30',
    Upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Ongoing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Completed: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30'
  }

  const difficultyColors = {
    Easy: 'text-green-400',
    Medium: 'text-yellow-400',
    Hard: 'text-red-400'
  }

  const isCreator = hackathon.createdBy === currentUser.username
  
  // Fallback image if no cover image
  const displayImage = hackathon.coverImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'

  return (
    <div 
      onClick={(e) => {
        e.preventDefault()
        navigate(`/dashboard/hackathons/${hackathon.id}`)
      }}
      className="group bg-neutral-900/40 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-all cursor-pointer"
    >
      {/* Cover Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={displayImage}
          alt={hackathon.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
        
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-medium border ${statusColors[hackathon.status]}`}>
          {hackathon.status}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-900/70 text-neutral-300 border border-neutral-700/50">
          {hackathon.category}
        </div>

        {/* Creator Badge */}
        {isCreator && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/50 backdrop-blur-sm flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Created by You
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-white mb-1.5 group-hover:text-blue-400 transition-colors line-clamp-1">
          {hackathon.name}
        </h3>
        <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{hackathon.tagline}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-neutral-400 mb-4">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="text-white">{hackathon.participants}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
            </svg>
            <span className="text-white">
              {Array.isArray(hackathon.rounds) ? hackathon.rounds.length : hackathon.rounds} rounds
            </span>
          </span>
        </div>

        {/* Prize & Difficulty */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
          <div>
            <div className="text-xs text-neutral-500 mb-0.5">Prize Pool</div>
            <div className="text-lg font-bold text-green-400">{hackathon.prizePool}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-neutral-500 mb-0.5">Difficulty</div>
            <div className={`text-sm font-semibold ${difficultyColors[hackathon.difficulty]}`}>
              {hackathon.difficulty}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
