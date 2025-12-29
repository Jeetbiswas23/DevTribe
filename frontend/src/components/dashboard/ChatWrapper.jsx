import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Chat from './Chat'

export default function ChatWrapper() {
  const location = useLocation()
  const navigate = useNavigate()
  const [pendingChatUser, setPendingChatUser] = useState(null)

  useEffect(() => {
    // Get pending chat user from location state
    if (location.state?.pendingChatUser) {
      console.log('📬 ChatWrapper received pendingChatUser:', location.state.pendingChatUser)
      setPendingChatUser(location.state.pendingChatUser)
    }
  }, [location.state])

  const handleChatOpened = () => {
    // Clear pending chat user after chat is opened
    console.log('✅ Chat opened, clearing pending user and state')
    setPendingChatUser(null)
    // Clear the navigation state
    if (location.state?.pendingChatUser) {
      navigate(location.pathname, { replace: true, state: {} })
    }
  }

  return <Chat pendingChatUser={pendingChatUser} onChatOpened={handleChatOpened} />
}
