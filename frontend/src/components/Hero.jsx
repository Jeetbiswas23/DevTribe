import { useNavigate } from "react-router-dom"

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Beta badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/15 backdrop-blur-sm mb-16 group hover:border-white/30 transition-all">
        <span className="text-purple-300 text-xs animate-pulse">⚡</span>
        <span className="text-white/70 text-xs font-light">Welcome to the beta version!</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-6xl sm:text-7xl md:text-8xl font-light text-white mb-8 leading-tight text-center max-w-5xl text-balance tracking-tight">
        Where Developers Build,
        <br />
        <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
          Connect, and Grow
        </span>
        <br />
        Together.
      </h1>

      {/* Subheadline */}
      <p className="text-base text-white/50 text-center mb-16 max-w-2xl font-light leading-relaxed">
        Join the ultimate tribe of hackers, designers, and creators. Find teammates, join hackathons,
        <br />
        collaborate in real time, and showcase your projects — all in one place.
      </p>

      {/* CTA Buttons and Social Proof */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-24">
        <button
          onClick={() => navigate("/auth")}
          className="px-8 py-3 bg-white text-black rounded-full text-sm font-light hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 group"
        >
          <span>Find Your Team</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>

        <button
          onClick={() => navigate("/auth")}
          className="px-8 py-3 bg-white text-black rounded-full text-sm font-light hover:bg-gray-100 transition-all duration-300 flex items-center gap-2"
        >
          <span>Host a Hackathon</span>
        </button>

        {/* Social Proof */}
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-black/40" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-black/40" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-black/40" />
          </div>
          <span className="text-white/60 text-sm font-light">
            Trusted by 20K+
            <br />
            developers worldwide
          </span>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-7xl">
        {[
          {
            icon: "🤖",
            title: "AI Team Matcher",
            desc: "Our AI finds teammates who complement your skills, timezone, and interests.",
          },
          {
            icon: "👥",
            title: "Create or Join Teams",
            desc: "Start a team or browse existing ones for upcoming hackathons.",
          },
          { icon: "💬", title: "Smart Chat & Video", desc: "Real-time messaging, calls, and screen sharing built-in." },
          {
            icon: "📅",
            title: "Hackathon Discovery",
            desc: "Find, join, or host hackathons worldwide — all in one place.",
          },
          {
            icon: "🧩",
            title: "Project Workspaces",
            desc: "Manage tasks, deadlines, and share code in one collaborative space.",
          },
          { icon: "📢", title: "Dev Feed", desc: "Follow developers, share updates, and build your personal brand." },
          {
            icon: "🧠",
            title: "AI Resume Builder",
            desc: "Generate a dev resume from your projects and contributions instantly.",
          },
          {
            icon: "🏆",
            title: "Achievements & Badges",
            desc: "Earn XP, rank up, and collect badges as you build and win.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm hover:border-white/30 hover:bg-white/5 transition-all duration-300"
          >
            <div className="text-2xl mb-4">{item.icon}</div>
            <h3 className="text-white font-light text-base mb-3">{item.title}</h3>
            <p className="text-white/40 text-xs font-light leading-relaxed mb-6">{item.desc}</p>
            <button className="text-white/40 hover:text-white text-xs border border-white/20 px-3 py-1.5 rounded-full transition-colors font-light">
              Learn more →
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
