import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Documentation from './pages/Documentation'
import Hackathons from './pages/Hackathons'
import CreateHackathon from './pages/CreateHackathon'
import HackathonDetails from './pages/HackathonDetails'
import Teams from './pages/Teams'
import UserProfile from './pages/UserProfile'
import FollowersList from './pages/FollowersList'
import FollowingList from './pages/FollowingList'
import Notifications from './pages/Notifications'
import Feed from './components/dashboard/Feed'
import Tribe from './components/dashboard/Tribe'
import ChatWrapper from './components/dashboard/ChatWrapper'
import Profile from './components/dashboard/Profile'
import Judge from './components/dashboard/Judge'
import HR from './components/dashboard/HR'
import DashboardHackathons from './components/dashboard/Hackathons'
import DashboardHackathonDetails from './components/dashboard/HackathonDetails'
import DashboardCreateHackathon from './components/dashboard/CreateHackathon'
import MyHackathons from './components/dashboard/MyHackathons'
import MCQRound from './components/dashboard/MCQRound'
import CodingRound from './components/dashboard/CodingRound'

import { useAuth } from './context/AuthContext'

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-black text-white">Loading...</div>
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />

      {/* Dashboard with nested routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard/feed" replace />} />
        <Route path="feed" element={<Feed />} />
        <Route path="tribe" element={<Tribe />} />
        <Route path="chat" element={<ChatWrapper />} />
        <Route path="profile" element={<Profile />} />
        <Route path="hackathons" element={<DashboardHackathons />} />
        <Route path="hackathons/my" element={<MyHackathons />} />
        <Route path="hackathons/create" element={<DashboardCreateHackathon />} />
        <Route path="hackathons/:id" element={<DashboardHackathonDetails />} />
        <Route path="judge" element={<Judge />} />
        <Route path="hr" element={<HR />} />
      </Route>

      {/* Hackathon Rounds - Standalone Pages (Not inside Dashboard) */}
      <Route path="/hackathons/:hackathonId/rounds/:roundId/mcq" element={<ProtectedRoute><MCQRound /></ProtectedRoute>} />
      <Route path="/hackathons/:hackathonId/rounds/:roundId/coding" element={<ProtectedRoute><CodingRound /></ProtectedRoute>} />

      {/* Hackathon Routes */}
      <Route path="/hackathons" element={<Hackathons />} />
      <Route path="/hackathons/create" element={<ProtectedRoute><CreateHackathon /></ProtectedRoute>} />
      <Route path="/hackathons/:id" element={<HackathonDetails />} />

      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/user/:username" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      <Route path="/followers" element={<ProtectedRoute><FollowersList /></ProtectedRoute>} />
      <Route path="/following" element={<ProtectedRoute><FollowingList /></ProtectedRoute>} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/teams" element={<Teams />} />
    </Routes>
  )
}

export default App
