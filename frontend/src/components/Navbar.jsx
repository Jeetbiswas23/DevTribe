import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
  const navigate = useNavigate()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo - DevTribe with tagline */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-7 sm:h-7 border-2 border-white rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white" />
            </div>
            <div>
              <div className="text-white font-light text-sm sm:text-base tracking-wide">DevTribe</div>
              <div className="text-white/40 font-light text-xs hidden sm:block">Where Developers Belong.</div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            <button
              onClick={() => navigate("/")}
              className="text-white/60 hover:text-white text-sm transition-colors font-light"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/teams")}
              className="text-white/60 hover:text-white text-sm transition-colors font-light"
            >
              Teams
            </button>
            <button
              onClick={() => navigate("/documentation")}
              className="text-white/60 hover:text-white text-sm transition-colors font-light"
            >
              About
            </button>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/auth")}
              className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-white hover:text-white text-xs sm:text-sm transition-colors font-light border border-white/20 rounded-full hover:border-white/40"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2.5 bg-white text-black rounded-full text-xs sm:text-sm font-light hover:bg-gray-100 transition-all duration-300"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showMobileMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <button
              onClick={() => {
                navigate("/")
                setShowMobileMenu(false)
              }}
              className="block w-full text-left px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate("/teams")
                setShowMobileMenu(false)
              }}
              className="block w-full text-left px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              Teams
            </button>
            <button
              onClick={() => {
                navigate("/documentation")
                setShowMobileMenu(false)
              }}
              className="block w-full text-left px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              About
            </button>
            <div className="flex sm:hidden flex-col gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  navigate("/auth")
                  setShowMobileMenu(false)
                }}
                className="w-full px-4 py-2 text-white text-sm border border-white/20 rounded-full hover:border-white/40 transition"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate("/auth")
                  setShowMobileMenu(false)
                }}
                className="w-full px-4 py-2 bg-white text-black rounded-full text-sm hover:bg-gray-100 transition"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
