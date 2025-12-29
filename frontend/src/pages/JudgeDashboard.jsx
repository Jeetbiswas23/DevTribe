import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const JudgeDashboard = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [activeHackathon, setActiveHackathon] = useState(null)
  const [showJudgingForm, setShowJudgingForm] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  
  const [scores, setScores] = useState({
    innovation: 0,
    execution: 0,
    design: 0,
    impact: 0,
    comments: ''
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user || user.userType !== 'judge') {
      navigate('/auth')
      return
    }
    setUserData(user)
  }, [navigate])

  // Mock data for upcoming hackathons
  const upcomingHackathons = [
    {
      id: 1,
      name: 'AI Innovation Challenge 2024',
      date: 'March 15-17, 2024',
      participants: 156,
      submissions: 45,
      status: 'In Progress',
      category: 'Artificial Intelligence'
    },
    {
      id: 2,
      name: 'Web3 Build Fest',
      date: 'March 22-24, 2024',
      participants: 89,
      submissions: 32,
      status: 'Upcoming',
      category: 'Blockchain'
    },
    {
      id: 3,
      name: 'Green Tech Hackathon',
      date: 'April 5-7, 2024',
      participants: 234,
      submissions: 78,
      status: 'In Progress',
      category: 'Sustainability'
    },
  ]

  // Mock submissions
  const submissions = [
    {
      id: 1,
      teamName: 'Code Warriors',
      projectName: 'AI-Powered Code Review',
      members: 4,
      githubUrl: 'https://github.com/example/project',
      demoUrl: 'https://demo.example.com',
      description: 'An AI-powered tool that automatically reviews code and suggests improvements',
      scored: false
    },
    {
      id: 2,
      teamName: 'Innovation Squad',
      projectName: 'Smart Health Monitor',
      members: 3,
      githubUrl: 'https://github.com/example/health',
      demoUrl: 'https://health.example.com',
      description: 'IoT-based health monitoring system with real-time alerts',
      scored: true
    },
  ]

  const handleScoreChange = (category, value) => {
    setScores(prev => ({ ...prev, [category]: value }))
  }

  const handleSubmitScore = () => {
    // Save scores to backend
    console.log('Submitting scores:', scores, 'for submission:', selectedSubmission)
    alert('Scores submitted successfully!')
    setShowJudgingForm(false)
    setSelectedSubmission(null)
    setScores({ innovation: 0, execution: 0, design: 0, impact: 0, comments: '' })
  }

  const handleStartJudging = (hackathon) => {
    setActiveHackathon(hackathon)
  }

  const handleJudgeSubmission = (submission) => {
    setSelectedSubmission(submission)
    setShowJudgingForm(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/auth')
  }

  if (!userData) return null

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">⚖️</span>
                <span>Judge Dashboard</span>
              </h1>
              <p className="text-slate-400 mt-1">Welcome back, {userData.name}</p>
            </div>
            <div className="flex items-center gap-4">
              {userData.verified ? (
                <span className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified Judge
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
              <p className="text-slate-400 text-sm">Active Hackathons</p>
              <p className="text-2xl font-bold text-white mt-1">3</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Total Submissions</p>
              <p className="text-2xl font-bold text-white mt-1">155</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Scored</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">87</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">68</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!activeHackathon ? (
          <>
            {/* Upcoming Hackathons */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🏆</span>
                Upcoming Hackathons
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingHackathons.map(hackathon => (
                  <div
                    key={hackathon.id}
                    className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 hover:border-blue-500/50 transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white">{hackathon.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        hackathon.status === 'In Progress' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {hackathon.status}
                      </span>
                    </div>
                    
                    <p className="text-slate-400 text-sm mb-4">{hackathon.date}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Category:</span>
                        <span className="text-white">{hackathon.category}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Participants:</span>
                        <span className="text-white">{hackathon.participants}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Submissions:</span>
                        <span className="text-blue-400 font-medium">{hackathon.submissions}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartJudging(hackathon)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
                    >
                      Start Judging
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Judge Profile */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Your Profile</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Position</p>
                  <p className="text-white font-medium">{userData.position}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Company</p>
                  <p className="text-white font-medium">{userData.company}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Experience</p>
                  <p className="text-white font-medium">{userData.yearsOfExperience} years</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Expertise</p>
                  <p className="text-white font-medium">{userData.expertise}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Judging Interface */}
            <button
              onClick={() => setActiveHackathon(null)}
              className="mb-6 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Hackathons
            </button>

            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">{activeHackathon.name}</h2>
              <p className="text-slate-400">{activeHackathon.date}</p>
            </div>

            {/* Submissions List */}
            <div className="space-y-4">
              {submissions.map(submission => (
                <div
                  key={submission.id}
                  className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{submission.projectName}</h3>
                      <p className="text-slate-400">Team: {submission.teamName} ({submission.members} members)</p>
                    </div>
                    {submission.scored && (
                      <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm font-medium">
                        Scored ✓
                      </span>
                    )}
                  </div>

                  <p className="text-slate-300 mb-4">{submission.description}</p>

                  <div className="flex items-center gap-4 mb-4">
                    <a
                      href={submission.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                    <a
                      href={submission.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Demo
                    </a>
                  </div>

                  <button
                    onClick={() => handleJudgeSubmission(submission)}
                    disabled={submission.scored}
                    className={`w-full py-2 rounded-lg font-medium transition ${
                      submission.scored
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {submission.scored ? 'Already Scored' : 'Judge This Project'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Judging Form Modal */}
      {showJudgingForm && selectedSubmission && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Judge: {selectedSubmission.projectName}
              </h2>

              <div className="space-y-6">
                {/* Innovation Score */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Innovation & Creativity ({scores.innovation}/10)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={scores.innovation}
                    onChange={(e) => handleScoreChange('innovation', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>

                {/* Execution Score */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Technical Execution ({scores.execution}/10)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={scores.execution}
                    onChange={(e) => handleScoreChange('execution', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>

                {/* Design Score */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Design & UX ({scores.design}/10)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={scores.design}
                    onChange={(e) => handleScoreChange('design', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>

                {/* Impact Score */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Impact & Usefulness ({scores.impact}/10)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={scores.impact}
                    onChange={(e) => handleScoreChange('impact', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>

                {/* Total Score */}
                <div className="bg-blue-600/20 border border-blue-500/50 rounded-lg p-4">
                  <p className="text-blue-400 font-medium">Total Score</p>
                  <p className="text-4xl font-bold text-white mt-1">
                    {scores.innovation + scores.execution + scores.design + scores.impact}/40
                  </p>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-white font-medium mb-2">Comments & Feedback</label>
                  <textarea
                    value={scores.comments}
                    onChange={(e) => handleScoreChange('comments', e.target.value)}
                    placeholder="Provide constructive feedback..."
                    rows={4}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowJudgingForm(false)
                      setSelectedSubmission(null)
                      setScores({ innovation: 0, execution: 0, design: 0, impact: 0, comments: '' })
                    }}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitScore}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                  >
                    Submit Score
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JudgeDashboard
