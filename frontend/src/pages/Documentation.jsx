import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'

export default function Documentation() {
  const navigate = useNavigate()

  const features = [
    {
      title: "AI Team Matcher",
      description: "Our AI finds teammates who complement your skills, timezone, and interests.",
      details: [
        "Smart algorithm matches you with developers based on technical skills, experience level, and project interests",
        "Timezone compatibility ensures smooth collaboration across different regions",
        "Personality and work style matching for better team dynamics",
        "Real-time availability tracking to find teammates who are ready to start"
      ]
    },
    {
      title: "Create or Join Teams",
      description: "Start a team or browse existing ones for upcoming hackathons.",
      details: [
        "Create your own team with custom requirements and project goals",
        "Browse hundreds of teams looking for specific roles and skills",
        "Filter teams by hackathon, tech stack, experience level, and more",
        "Send join requests and get instant notifications on acceptances"
      ]
    },
    {
      title: "Smart Chat & Video",
      description: "Real-time messaging, calls, and screen sharing built-in.",
      details: [
        "Instant messaging with rich text formatting and code snippets",
        "HD video calls with up to 10 team members simultaneously",
        "Screen sharing for code reviews and collaborative debugging",
        "File sharing with drag-and-drop support for images, documents, and code"
      ]
    },
    {
      title: "Hackathon Discovery",
      description: "Find, join, or host hackathons worldwide — all in one place.",
      details: [
        "Comprehensive calendar of upcoming hackathons worldwide",
        "Filter by location (online/in-person), dates, prizes, and themes",
        "Detailed hackathon pages with rules, judging criteria, and sponsors",
        "Registration tracking and deadline reminders"
      ]
    },
    {
      title: "Project Workspaces",
      description: "Manage tasks, deadlines, and share code in one collaborative space.",
      details: [
        "Kanban boards for visual task management and sprint planning",
        "GitHub integration for seamless code collaboration",
        "Shared code editor with real-time collaborative editing",
        "Deadline tracking with automatic reminders and progress updates"
      ]
    },
    {
      title: "Dev Feed",
      description: "Follow developers, share updates, and build your personal brand.",
      details: [
        "Share project updates, wins, and learnings with the community",
        "Follow developers whose work inspires you",
        "Engage with posts through likes, comments, and shares",
        "Showcase your portfolio directly in your profile"
      ]
    },
    {
      title: "AI Resume Builder",
      description: "Generate a dev resume from your projects and contributions instantly.",
      details: [
        "Automatically pulls data from your DevTribe profile and GitHub",
        "AI-powered descriptions that highlight your technical achievements",
        "Multiple professional templates optimized for tech roles",
        "Export to PDF, Word, or LinkedIn-ready formats"
      ]
    },
    {
      title: "Achievements & Badges",
      description: "Earn XP, rank up, and collect badges as you build and win.",
      details: [
        "Earn XP for completing hackathons, winning prizes, and helping others",
        "Unlock exclusive badges for milestones like first win, 10 hackathons, etc.",
        "Level up your profile with ranks from Beginner to Legendary Developer",
        "Leaderboards show top contributors, winners, and active community members"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Minimal Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 pt-32 pb-24 px-6">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto mb-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-light text-white mb-8 tracking-tight">
              Documentation
            </h1>
            <p className="text-xl text-white/40 font-light leading-relaxed">
              Everything you need to know about DevTribe's features.
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="max-w-5xl mx-auto space-y-32 mb-32">
          {features.map((feature, index) => (
            <div key={index} className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-4xl sm:text-5xl font-light text-white mb-6 tracking-tight">
                  {feature.title}
                </h2>
                <p className="text-lg text-white/50 font-light leading-relaxed mb-8">
                  {feature.description}
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="group inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300"
                >
                  <span className="text-sm font-light tracking-wide">Explore Feature</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                {feature.details.map((detail, idx) => (
                  <div key={idx} className="border-l border-white/10 pl-6 py-2 hover:border-white/30 transition-colors duration-300">
                    <p className="text-white/60 font-light leading-relaxed">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="max-w-5xl mx-auto">
          <div className="border border-white/10 rounded-none p-16 text-center">
            <h2 className="text-4xl sm:text-5xl font-light text-white mb-6 tracking-tight">
              Ready to get started?
            </h2>
            <p className="text-lg text-white/50 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of developers building the future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/auth')}
                className="px-8 py-4 bg-white text-black font-light hover:bg-white/90 transition-colors duration-300"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="px-8 py-4 border border-white/20 text-white font-light hover:bg-white/5 transition-colors duration-300"
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
