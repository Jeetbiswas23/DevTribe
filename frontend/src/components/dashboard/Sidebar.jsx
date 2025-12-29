export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-neutral-900/80 border-r border-neutral-800 backdrop-blur-xl p-6 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
          <span className="text-lg font-bold text-white">DT</span>
        </div>
        <span className="text-xl font-bold text-white">DevTribe</span>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {[
          { id: "feed", label: "Feed", icon: "📰" },
          { id: "profile", label: "Profile", icon: "🧑‍💻" },
          { id: "tribe", label: "Tribe", icon: "👥" },
          { id: "chat", label: "Chat", icon: "💬" },
          { id: "hackathons", label: "Hackathons", icon: "🏆" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === item.id
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-neutral-800 pt-4 space-y-3">
        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-neutral-800/50 transition">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
            <div>
              <p className="text-sm font-medium text-white">John Doe</p>
              <p className="text-xs text-neutral-500">Developer</p>
            </div>
          </div>
        </button>
        <button className="w-full px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 text-left transition">
          Sign Out
        </button>
      </div>
    </div>
  )
}
