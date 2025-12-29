export default function Features() {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* About/Vision Section */}
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl font-light text-white mb-8 leading-tight text-balance">
            Empowering the Next Generation of Developers
          </h2>
          <p className="text-white/50 text-lg font-light max-w-3xl mx-auto mb-8 leading-relaxed">
            DevTribe isn't just a platform — it's a movement. We're creating a digital home where developers connect
            with purpose, form powerful teams, and turn ideas into impactful products.
          </p>
          <div className="inline-block px-6 py-3 bg-white/5 border border-white/15 rounded-full mb-8">
            <p className="text-white/70 font-light italic">
              "We believe great things happen when brilliant minds unite."
            </p>
          </div>
          <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm font-light hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300">
            Explore the Tribe
          </button>
        </div>

        {/* Another Feature Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-light text-white mb-6">One Platform. Infinite Possibilities.</h3>
            <p className="text-white/50 font-light leading-relaxed mb-8">
              From finding your perfect hackathon team to showcasing your next big project — DevTribe does it all.
              Everything you need to succeed as a developer, in one place.
            </p>
            <button className="px-6 py-2 bg-white/5 border border-white/20 text-white rounded-full text-sm font-light hover:border-white/40 transition-all">
              Get Started →
            </button>
          </div>
          <div className="h-96 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/10 flex items-center justify-center">
            <span className="text-white/30 font-light">Visual showcase</span>
          </div>
        </div>
      </div>
    </section>
  )
}
