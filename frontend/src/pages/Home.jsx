import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Features from '@/components/Features'

export default function Home() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black" />
        {/* Grid overlay - precise white grid like Oise Banking */}
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
        <Hero />
        <Features />
      </div>
    </div>
  )
}
