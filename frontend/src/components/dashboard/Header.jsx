import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  return (
    <div className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-xl px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, John</h1>
          <p className="text-neutral-400 text-sm">Here's what's happening in your tribe today</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search developers, teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 w-64 transition"
            />
          </div>

          {/* Notifications */}
          <button 
            onClick={() => navigate('/notifications')}
            className="relative w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center hover:bg-neutral-700 transition"
          >
            <span className="text-lg">🔔</span>
            <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          </button>
        </div>
      </div>
    </div>
  )
}
