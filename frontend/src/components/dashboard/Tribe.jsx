import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Tribe() {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  
  const [teams, setTeams] = useState([])

  // Load teams from localStorage on mount
  useEffect(() => {
    const savedTeams = JSON.parse(localStorage.getItem('teams') || '[]')
    if (savedTeams.length === 0) {
      // Initialize with default teams
      const defaultTeams = [
        {
          id: 1,
          name: "AI Innovators",
          members: 4,
          maxMembers: 5,
          project: "Smart Code Assistant",
          hackathon: "TechCrunch Disrupt 2024",
          tech: ["React", "Python", "TensorFlow"],
          creator: {
            name: "Sarah Chen",
            username: "@sarahchen",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
          },
        },
        {
          id: 2,
          name: "Web Wizards",
          members: 3,
          maxMembers: 4,
          project: "Next-gen E-commerce Platform",
          hackathon: "HackMIT 2024",
          tech: ["Next.js", "Node.js", "MongoDB"],
          creator: {
            name: "Mike Johnson",
            username: "@mikej",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
          },
        },
      ]
      localStorage.setItem('teams', JSON.stringify(defaultTeams))
      setTeams(defaultTeams)
    } else {
      setTeams(savedTeams)
    }
  }, [])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [followedUsers, setFollowedUsers] = useState([])
  const [newTeam, setNewTeam] = useState({
    name: "",
    hackathon: "",
    description: "",
    requiredMembers: 4,
    tech: [],
    requiredSkills: [],
  })
  const [skillInput, setSkillInput] = useState("")

  const availableHackathons = [
    "TechCrunch Disrupt 2024",
    "HackMIT 2024",
    "Y Combinator Hackathon",
    "DevPost Global Hack",
    "ETHGlobal 2024",
    "Google Cloud Hackathon",
  ]

  const handleCreateTeam = () => {
    if (!newTeam.name || !newTeam.hackathon) {
      alert("Please fill in team name and select a hackathon")
      return
    }

    const team = {
      id: Date.now(),
      name: newTeam.name,
      members: 1,
      maxMembers: newTeam.requiredMembers,
      project: newTeam.description,
      hackathon: newTeam.hackathon,
      tech: newTeam.tech,
      creator: {
        name: currentUser.name || "John Doe",
        username: currentUser.username || "@johndoe",
        avatar: currentUser.avatar || null,
      },
      acceptedMembers: [], // Track accepted members
      createdAt: new Date().toISOString()
    }

    const updatedTeams = [team, ...teams]
    setTeams(updatedTeams)
    localStorage.setItem('teams', JSON.stringify(updatedTeams))
    
    setShowCreateModal(false)
    setNewTeam({ name: "", hackathon: "", description: "", requiredMembers: 4, tech: [], requiredSkills: [] })
    setSkillInput("")
  }

  const handleAddSkill = () => {
    if (skillInput.trim() && !newTeam.requiredSkills.includes(skillInput.trim())) {
      setNewTeam({ ...newTeam, requiredSkills: [...newTeam.requiredSkills, skillInput.trim()] })
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setNewTeam({ 
      ...newTeam, 
      requiredSkills: newTeam.requiredSkills.filter(skill => skill !== skillToRemove) 
    })
  }

  const handleViewUser = (user) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    
    // If viewing own profile
    if (user.username === currentUser.username || user.name === currentUser.name) {
      const event = new CustomEvent('switchTab', { detail: 'profile' })
      window.dispatchEvent(event)
      return
    }
    
    // Navigate to user profile page with state indicating we came from tribe
    const username = user.username.replace('@', '')
    navigate(`/user/${username}`, { state: { from: 'tribe' } })
  }

  const handleViewTeam = (team) => {
    const teamMembers = [
      {
        name: "Sarah Chen",
        username: "@sarahchen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        role: "Team Leader",
        bio: "Passionate developer building amazing products",
        location: "San Francisco, CA",
        skills: ["React", "Node.js", "Python"],
        followers: 1234,
        following: 567,
        posts: 42,
      },
      {
        name: "Mike Johnson",
        username: "@mikej",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
        role: "Backend Developer",
        bio: "Passionate developer building amazing products",
        location: "San Francisco, CA",
        skills: ["React", "Node.js", "Python"],
        followers: 1234,
        following: 567,
        posts: 42,
      },
      {
        name: "Alex Rodriguez",
        username: "@alexr",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        role: "Frontend Developer",
        bio: "Passionate developer building amazing products",
        location: "San Francisco, CA",
        skills: ["React", "Node.js", "Python"],
        followers: 1234,
        following: 567,
        posts: 42,
      },
    ]
    setSelectedTeam({ ...team, members: teamMembers })
    setShowTeamModal(true)
  }

  const handleApplyForTeam = (team) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    const userName = currentUser.name || "John Doe"
    const userUsername = currentUser.username || "@johndoe"
    const userAvatar = currentUser.avatar || null
    
    // Clean creator username (remove @ if present)
    const cleanUsername = team.creator.username.startsWith('@') 
      ? team.creator.username.substring(1) 
      : team.creator.username
    
    // Create team request
    const teamRequest = {
      id: Date.now(),
      teamId: team.id,
      teamName: team.name,
      applicant: {
        name: userName,
        username: userUsername,
        avatar: userAvatar
      },
      teamLeader: {
        username: cleanUsername,
        name: team.creator.name,
        avatar: team.creator.avatar
      },
      timestamp: new Date().toISOString(),
      status: 'pending', // pending, accepted, declined
      hackathon: team.hackathon,
      project: team.project
    }
    
    // Save team request
    const teamRequests = JSON.parse(localStorage.getItem('teamRequests') || '[]')
    teamRequests.push(teamRequest)
    localStorage.setItem('teamRequests', JSON.stringify(teamRequests))
    
    // Send notification to team leader
    const notificationEvent = new CustomEvent('newNotification', {
      detail: {
        type: 'team_request',
        title: 'New Team Request',
        message: `${userName} wants to join your team "${team.name}"`,
        data: teamRequest
      }
    })
    window.dispatchEvent(notificationEvent)
    
    // Create detailed application message
    const applicationMessage = `Hi! I am ${userName} (${userUsername})\n\nI would like to join your team:\n\n📋 ${team.name}\n👥 ${team.members}/${team.maxMembers} Members\n👤 Created by ${team.creator.name}\n🏆 ${team.hackathon}\n💡 ${team.project}\n\nCan I join your team? I'm excited to contribute and collaborate!`
    
    // Dispatch custom event to open chat with pre-filled message
    const event = new CustomEvent('openChat', { 
      detail: { 
        username: cleanUsername,
        name: team.creator.name,
        avatar: team.creator.avatar,
        message: applicationMessage 
      } 
    })
    window.dispatchEvent(event)
  }

  const handleFollow = (username) => {
    if (followedUsers.includes(username)) {
      setFollowedUsers(followedUsers.filter(u => u !== username))
    } else {
      setFollowedUsers([...followedUsers, username])
    }
  }

  const handleMessage = (user) => {
    // Clean username (remove @ if present)
    const cleanUsername = user.username.startsWith('@') 
      ? user.username.substring(1) 
      : user.username
      
    const event = new CustomEvent('openChat', { 
      detail: { 
        username: cleanUsername,
        name: user.name,
        avatar: user.avatar,
        message: "" 
      } 
    })
    window.dispatchEvent(event)
    
    // Close modal
    setShowUserModal(false)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Your Tribes</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition font-medium text-sm sm:text-base"
        >
          Create New Tribe
        </button>
      </div>

      <div className="grid gap-4 sm:gap-5 grid-cols-1 lg:grid-cols-2">
        {teams.map((team) => (
          <div key={team.id} className="bg-gradient-to-br from-neutral-900/90 to-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all group">
            {/* Team Header */}
            <div className="p-3 sm:p-4 border-b border-neutral-800">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition truncate">{team.name}</h3>
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-semibold">
                      {team.members}/{team.maxMembers}
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition mt-1"
                    onClick={() => handleViewUser(team.creator)}
                  >
                    <img src={team.creator.avatar} alt={team.creator.name} className="w-7 h-7 sm:w-6 sm:h-6 rounded-full ring-2 ring-neutral-700" />
                    <span className="text-neutral-400 text-sm truncate">
                      by <span className="text-blue-400 font-medium">{team.creator.name}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded-lg mt-2 sm:mt-0">
                  <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-purple-400 font-semibold text-xs sm:text-sm truncate max-w-[160px]">{team.hackathon}</span>
                </div>
              </div>
            </div>

            {/* Team Body */}
            <div className="p-3 sm:p-4">
              <p className="text-neutral-300 text-xs sm:text-sm mb-3 line-clamp-2">{team.project}</p>

              <div className="mb-3">
                <h4 className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Tech Stack</h4>
                <div className="flex gap-2 overflow-x-auto py-1">
                  {team.tech.map((tech, index) => (
                    <span
                      key={index}
                      className="flex-shrink-0 px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full text-xs font-medium hover:bg-blue-500/20 transition"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-neutral-800">
                <button 
                  onClick={() => handleViewTeam(team)}
                  className="flex-1 px-3 py-3 sm:py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition font-semibold text-sm sm:text-xs flex items-center justify-center gap-2 border border-neutral-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  View Team
                </button>
                <button 
                  onClick={() => handleApplyForTeam(team)}
                  className="flex-1 px-3 py-3 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition font-semibold text-sm sm:text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Apply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header - Sticky */}
            <div className="bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800 p-4 sm:p-5 md:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Create New Tribe</h2>
                  <p className="text-neutral-400 text-xs sm:text-sm mt-1">Build your dream team for the hackathon</p>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-full p-2 transition flex-shrink-0">
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5">
              <div>
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                  Team Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., AI Innovators, Code Ninjas"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                  Hackathon <span className="text-red-500">*</span>
                </label>
                <select
                  value={newTeam.hackathon}
                  onChange={(e) => setNewTeam({ ...newTeam, hackathon: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                >
                  <option value="">Select a hackathon</option>
                  {availableHackathons.map((hackathon) => (
                    <option key={hackathon} value={hackathon}>{hackathon}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Project Description</label>
                <textarea
                  placeholder="Describe your project idea and what you're building..."
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                  Required Skills <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., React, Python, UI/UX Design"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddSkill()
                      }
                    }}
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition text-sm sm:text-base whitespace-nowrap"
                  >
                    Add Skill
                  </button>
                </div>
                <p className="text-neutral-500 text-xs sm:text-sm mt-1.5">Add required skills for your team members</p>
                
                {/* Display Added Skills */}
                {newTeam.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {newTeam.requiredSkills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 text-sm"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-blue-300 hover:text-white transition"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Team Size</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="2"
                    max="10"
                    value={newTeam.requiredMembers}
                    onChange={(e) => setNewTeam({ ...newTeam, requiredMembers: parseInt(e.target.value) })}
                    className="flex-1 accent-blue-500"
                  />
                  <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 font-bold min-w-[60px] text-center">
                    {newTeam.requiredMembers}
                  </div>
                </div>
                <p className="text-neutral-500 text-xs sm:text-sm mt-1.5">Total members including you</p>
              </div>
            </div>

            {/* Modal Footer - Sticky */}
            <div className="bg-neutral-900/95 backdrop-blur-sm border-t border-neutral-800 p-4 sm:p-5 md:p-6">
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition text-sm sm:text-base font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTeam}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition font-semibold text-sm sm:text-base shadow-lg shadow-blue-500/20"
                >
                  Create Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Members Modal */}
      {showTeamModal && selectedTeam && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6" onClick={() => setShowTeamModal(false)}>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header - Sticky */}
            <div className="bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedTeam.name}</h2>
                  <p className="text-neutral-400 mt-1 text-sm sm:text-base">{selectedTeam.hackathon}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-medium">
                      {selectedTeam.currentMembers}/{selectedTeam.totalMembers} Members
                    </span>
                  </div>
                </div>
                <button onClick={() => setShowTeamModal(false)} className="text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-full p-2 transition">
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <h3 className="text-white font-bold mb-4 text-base sm:text-lg flex items-center gap-2">
                <span>👥</span> Team Members
              </h3>
              <div className="grid gap-3 sm:gap-4">
                {selectedTeam.members.map((member, index) => (
                  <div 
                    key={index} 
                    className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-3 sm:p-4 hover:border-blue-500/50 hover:bg-neutral-800/70 transition cursor-pointer group"
                    onClick={() => handleViewUser(member)}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <img src={member.avatar} alt={member.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full ring-2 ring-neutral-700 group-hover:ring-blue-500 transition" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="text-white font-semibold text-sm sm:text-base group-hover:text-blue-400 transition truncate">{member.name}</h4>
                            <p className="text-neutral-400 text-xs sm:text-sm truncate">{member.username}</p>
                            <p className="text-blue-400 text-xs sm:text-sm mt-1 font-medium">{member.role}</p>
                          </div>
                          <button className="hidden sm:block px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500/20 hover:bg-blue-500 border border-blue-500/50 hover:border-blue-500 text-blue-400 hover:text-white rounded-lg transition text-xs sm:text-sm font-medium flex-shrink-0">
                            View Profile
                          </button>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-3 text-neutral-400 text-xs sm:text-sm">
                          <span className="flex items-center gap-1">
                            <span className="text-blue-400">👥</span> {member.followers}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-green-400">✓</span> {member.following}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-purple-400">📝</span> {member.posts}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6" onClick={() => setShowUserModal(false)}>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header - Sticky */}
            <div className="bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800 p-4 sm:p-6 flex items-center justify-between">
              <h2 className="text-lg sm:text-2xl font-bold text-white">User Profile</h2>
              <button onClick={() => setShowUserModal(false)} className="text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-full p-2 transition">
                ✕
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <img src={selectedUser.avatar} alt={selectedUser.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-4 ring-blue-500/20" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-white truncate">{selectedUser.name}</h3>
                  <p className="text-neutral-400 mt-1 text-sm sm:text-base">{selectedUser.username}</p>
                  
                  <div className="flex items-center gap-4 sm:gap-6 mt-4">
                    <div className="text-center">
                      <p className="text-lg sm:text-xl font-bold text-white">{selectedUser.followers}</p>
                      <p className="text-neutral-400 text-xs sm:text-sm">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg sm:text-xl font-bold text-white">{selectedUser.following}</p>
                      <p className="text-neutral-400 text-xs sm:text-sm">Following</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg sm:text-xl font-bold text-white">{selectedUser.posts}</p>
                      <p className="text-neutral-400 text-xs sm:text-sm">Posts</p>
                    </div>
                  </div>

                  <div className="mt-4 bg-neutral-800/50 border border-neutral-700 rounded-xl p-3 sm:p-4">
                    <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">{selectedUser.bio}</p>
                  </div>

                  {selectedUser.location && (
                    <div className="flex items-center gap-2 mt-3 text-neutral-400 text-sm sm:text-base">
                      <span>📍</span>
                      <span>{selectedUser.location}</span>
                    </div>
                  )}

                  <div className="mt-5">
                    <h4 className="text-white font-bold mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <span>⚡</span> Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs sm:text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button 
                      onClick={() => handleFollow(selectedUser.username)}
                      className={`flex-1 px-6 py-2.5 rounded-xl transition font-semibold text-sm sm:text-base ${
                        followedUsers.includes(selectedUser.username)
                          ? 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/20'
                      }`}
                    >
                      {followedUsers.includes(selectedUser.username) ? '✓ Following' : '+ Follow'}
                    </button>
                    <button 
                      onClick={() => handleMessage(selectedUser)}
                      className="flex-1 px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition font-semibold border border-neutral-700 text-sm sm:text-base"
                    >
                      Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
