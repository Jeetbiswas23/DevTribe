import Navbar from '@/components/Navbar'
import { useNavigate } from 'react-router-dom'

export default function Teams() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black" />
        {/* Grid overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div className="absolute -top-32 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-25 -mr-48" />
        <div className="absolute top-0 right-32 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl opacity-20" />
        <div className="absolute top-40 right-1/3 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-15" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        
        <section className="min-h-screen px-6 py-24">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/15 backdrop-blur-sm mb-8">
                <span className="text-blue-300 text-xs">👥</span>
                <span className="text-white/70 text-xs font-light">Explore Active Teams</span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-light text-white mb-6 leading-tight">
                Discover Your
                <br />
                <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Next Team
                </span>
              </h1>

              <p className="text-base text-white/50 max-w-3xl mx-auto font-light leading-relaxed">
                Browse active teams looking for talented developers, or create your own and find the perfect collaborators.
              </p>
            </div>

            {/* CTA to Login */}
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-white/10 rounded-2xl p-12 backdrop-blur-sm text-center mb-16">
              <h2 className="text-3xl font-light text-white mb-4">
                Sign in to Browse Teams
              </h2>
              <p className="text-white/60 text-base font-light mb-8 max-w-2xl mx-auto">
                Create an account or sign in to access our team discovery platform and start connecting with developers.
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/auth')}
                  className="px-8 py-3 bg-white text-black rounded-full text-sm font-light hover:bg-gray-100 transition-all duration-300"
                >
                  Sign In to View Teams
                </button>
                <button
                  onClick={() => navigate('/hackathons')}
                  className="px-8 py-3 bg-white/5 border border-white/20 text-white rounded-full text-sm font-light hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                >
                  Learn How It Works
                </button>
              </div>
            </div>

            {/* Preview Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-light text-white mb-2">Smart Search</h3>
                <p className="text-white/50 text-sm font-light">
                  Filter teams by hackathon, tech stack, roles needed, and more
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-xl font-light text-white mb-2">Instant Connect</h3>
                <p className="text-white/50 text-sm font-light">
                  Chat with team leads and members before sending join requests
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-light text-white mb-2">Perfect Match</h3>
                <p className="text-white/50 text-sm font-light">
                  AI recommendations based on your skills and preferences
                </p>
              </div>
            </div>

            {/* Sample Team Cards (Preview) */}
            <div className="space-y-6">
              <h2 className="text-2xl font-light text-white mb-6">Featured Teams</h2>
              
              {[
                {
                  name: "Web3 Innovators",
                  hackathon: "ETH Global 2025",
                  needed: ["Smart Contract Dev", "Frontend Developer"],
                  skills: ["Solidity", "React", "Web3.js"],
                  members: 3,
                  maxMembers: 5
                },
                {
                  name: "AI Dream Team",
                  hackathon: "AI Hackathon Summit",
                  needed: ["ML Engineer", "Backend Dev"],
                  skills: ["Python", "TensorFlow", "FastAPI"],
                  members: 2,
                  maxMembers: 4
                },
                {
                  name: "FinTech Builders",
                  hackathon: "FinTech Challenge 2025",
                  needed: ["Full Stack Dev", "UI/UX Designer"],
                  skills: ["Node.js", "React", "PostgreSQL"],
                  members: 3,
                  maxMembers: 5
                }
              ].map((team, index) => (
                <div
                  key={index}
                  className="bg-white/[0.03] border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:border-white/30 hover:bg-white/5 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Blur overlay for preview */}
                  <div className="absolute inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-10">
                    <button
                      onClick={() => navigate('/auth')}
                      className="px-6 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-100 transition-all duration-300"
                    >
                      Sign in to View Details →
                    </button>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-medium text-white">{team.name}</h3>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs">
                          Recruiting
                        </span>
                      </div>
                      <p className="text-white/50 text-sm mb-4">{team.hackathon}</p>

                      <div className="space-y-3">
                        <div>
                          <p className="text-white/40 text-xs mb-2">Looking for:</p>
                          <div className="flex flex-wrap gap-2">
                            {team.needed.map((role, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-xs"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-white/40 text-xs mb-2">Tech Stack:</p>
                          <div className="flex flex-wrap gap-2">
                            {team.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <p className="text-white/40 text-sm">
                        {team.members}/{team.maxMembers} members
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
