import { useState, useEffect, useRef, useLayoutEffect } from "react"

export default function Chat({ pendingChatUser, onChatOpened }) {
  const [selectedChat, setSelectedChat] = useState(null)
  const [chats, setChats] = useState([])
  const [messages, setMessages] = useState({})
  const [newMessage, setNewMessage] = useState("")
  const [messageMenuOpen, setMessageMenuOpen] = useState(null)
  const [editingMessage, setEditingMessage] = useState(null)
  const [editMessageText, setEditMessageText] = useState("")
  const [showDeleteConversation, setShowDeleteConversation] = useState(false)
  const [activeChannel, setActiveChannel] = useState('general')
  const [showChannelSidebar, setShowChannelSidebar] = useState(true)
  const [showCreateChannel, setShowCreateChannel] = useState(false)
  const [newChannelName, setNewChannelName] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showFileMenu, setShowFileMenu] = useState(false)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [memberMenuOpen, setMemberMenuOpen] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [showMentions, setShowMentions] = useState(false)
  const [mentionSearch, setMentionSearch] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [expandedMedia, setExpandedMedia] = useState(null)
  const [playingAudio, setPlayingAudio] = useState(null)
  const [audioProgress, setAudioProgress] = useState({}) // Track progress for each audio
  const [audioDurations, setAudioDurations] = useState({}) // Track duration for each audio
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const loadingRef = useRef(false)
  const fileInputRef = useRef(null)
  const messageInputRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioRefs = useRef({});
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  const userHasScrolledUp = useRef(false)
  const lastChatId = useRef(null)
  const lastActiveChannel = useRef(null)
  // Call / Video state
  const [showCallModal, setShowCallModal] = useState(false)
  const [callType, setCallType] = useState(null) // 'voice' | 'video'
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [isMuted, setIsMuted] = useState(false)
  const [cameraOff, setCameraOff] = useState(false)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const [callSeconds, setCallSeconds] = useState(0)
  const pcRef = useRef(null)
  const channelRef = useRef(null)
  const localIdRef = useRef(`${Date.now()}-${Math.floor(Math.random() * 10000)}`)
  const [isCallConnected, setIsCallConnected] = useState(false)

  // Clean username (remove @ if present)
  const cleanCurrentUsername = currentUser.username
    ? (currentUser.username.startsWith('@') ? currentUser.username.substring(1) : currentUser.username)
    : ''

  // Load conversations from localStorage
  const loadConversations = () => {
    if (loadingRef.current) return
    loadingRef.current = true

    try {
      const conversations = JSON.parse(localStorage.getItem('conversations') || '[]')
      const following = JSON.parse(localStorage.getItem('following') || '[]')

      // Filter conversations where current user is a participant
      const userConversations = conversations.filter(conv =>
        conv.participants.includes(cleanCurrentUsername) ||
        conv.participants.includes(`@${cleanCurrentUsername}`)
      )

      // Create chat list from conversations
      const chatList = userConversations.map(conv => {
        if (conv.isGroup) {
          // Group chat
          const lastChannel = conv.activeChannel || 'general'
          const channelMessages = conv.messages[lastChannel] || []
          const lastMsg = channelMessages[channelMessages.length - 1]

          return {
            id: conv.id,
            name: conv.name,
            isGroup: true,
            teamId: conv.teamId,
            members: conv.members,
            channels: conv.channels,
            activeChannel: lastChannel,
            unread: 0,
            lastMessage: lastMsg ? `${lastMsg.sender}: ${lastMsg.text}` : 'Start chatting...',
            avatar: null,
            timestamp: lastMsg ? new Date(lastMsg.timestamp).getTime() : Date.now()
          }
        } else {
          // Regular DM
          const otherUser = conv.participants.find(p => {
            if (!p) return false
            const cleanP = p.startsWith('@') ? p.substring(1) : p
            return cleanP !== cleanCurrentUsername
          })

          if (!otherUser) return null // Skip invalid conversations

          const cleanOtherUser = otherUser.startsWith('@') ? otherUser.substring(1) : otherUser
          const followedUser = following.find(f => {
            if (!f || !f.username) return false
            const cleanF = f.username.startsWith('@') ? f.username.substring(1) : f.username
            return cleanF === cleanOtherUser
          })
          const lastMsg = conv.messages[conv.messages.length - 1]

          return {
            id: conv.id,
            username: cleanOtherUser,
            name: followedUser?.name || cleanOtherUser,
            isGroup: false,
            unread: 0,
            lastMessage: lastMsg ? lastMsg.message : 'Start chatting...',
            avatar: followedUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanOtherUser}`,
            timestamp: lastMsg ? lastMsg.timestamp : Date.now()
          }
        }
      }).filter(chat => chat !== null).sort((a, b) => b.timestamp - a.timestamp)

      setChats(chatList)

      // Load messages for each conversation
      const messagesObj = {}
      userConversations.forEach(conv => {
        if (conv.isGroup) {
          // For group chats, messages are organized by channel
          messagesObj[conv.id] = conv.messages || {}
        } else {
          // For DMs, messages is an array
          messagesObj[conv.id] = Array.isArray(conv.messages) ? conv.messages.map(msg => ({
            ...msg,
            isMe: msg.sender === cleanCurrentUsername || msg.sender === `@${cleanCurrentUsername}`
          })) : []
        }
      })
      setMessages(messagesObj)
    } finally {
      loadingRef.current = false
    }
  }

  useEffect(() => {
    loadConversations()

    // Poll for new messages every 2 seconds (real-time simulation)
    const interval = setInterval(loadConversations, 2000)
    return () => clearInterval(interval)
  }, [cleanCurrentUsername])

  // Close message menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messageMenuOpen && !event.target.closest('.message-menu-container')) {
        setMessageMenuOpen(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [messageMenuOpen])

  // Handle pending chat user from Dashboard
  useEffect(() => {
    if (pendingChatUser) {
      console.log('🎯 Chat component received pendingChatUser:', pendingChatUser)
      const { username, name, message, avatar } = pendingChatUser

      if (!username || !name) {
        console.error('❌ Missing username or name in pendingChatUser')
        return
      }

      // Clean username (remove @ if present)
      const cleanUsername = username.startsWith('@') ? username.substring(1) : username
      console.log('✅ Processing chat with:', cleanUsername, 'Current user:', cleanCurrentUsername)

      // Check if conversation already exists in localStorage
      const conversations = JSON.parse(localStorage.getItem('conversations') || '[]')
      const existingConv = conversations.find(conv =>
        (conv.participants.includes(cleanCurrentUsername) || conv.participants.includes(`@${cleanCurrentUsername}`)) &&
        (conv.participants.includes(cleanUsername) || conv.participants.includes(`@${cleanUsername}`))
      )

      if (!existingConv) {
        console.log('📝 Creating new conversation')
        // Create new conversation
        const newConvId = `conv_${Date.now()}`
        const newConversation = {
          id: newConvId,
          participants: [cleanCurrentUsername, cleanUsername],
          messages: []
        }
        conversations.push(newConversation)
        localStorage.setItem('conversations', JSON.stringify(conversations))
        console.log('💾 Saved conversation to localStorage:', newConversation)

        // Force reload conversations
        setTimeout(() => {
          loadConversations()
          setSelectedChat(newConvId)
          if (message) setNewMessage(message)
          console.log('✅ Chat created and selected:', newConvId)
          if (onChatOpened) onChatOpened()
        }, 100)
      } else {
        console.log('📂 Opening existing conversation:', existingConv.id)
        // Open existing chat
        setSelectedChat(existingConv.id)
        if (message) setNewMessage(message)
        if (onChatOpened) onChatOpened()
      }
    }
  }, [pendingChatUser, cleanCurrentUsername, onChatOpened])

  // Scroll behavior: Auto-scroll to bottom directly when opening/switching chats or when new messages arrive.
  // Using useLayoutEffect ensures the scroll happens synchronously after the DOM update but before paint,
  // preventing any visible jump or scroll animation.
  useLayoutEffect(() => {
    const chatChanged = selectedChat !== lastChatId.current
    const channelChanged = activeChannel !== lastActiveChannel.current

    if (chatChanged) {
      lastChatId.current = selectedChat
      // Reset scroll state when switching chats so we jump to bottom
      userHasScrolledUp.current = false
    }

    if (channelChanged) {
      lastActiveChannel.current = activeChannel
      userHasScrolledUp.current = false
    }

    // Scroll to bottom if:
    // 1. We just switched chat/channel
    // 2. OR new messages arrived and user hasn't scrolled up
    if ((chatChanged || channelChanged || !userHasScrolledUp.current) && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto', block: 'end' })
    }
  }, [selectedChat, activeChannel, messages])

  // Detect when user scrolls up manually
  const handleScroll = (e) => {
    const element = e.target
    const threshold = 50 // pixels from bottom
    const isScrolledToBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + threshold

    // If user is at bottom, reset the flag
    if (isScrolledToBottom) {
      userHasScrolledUp.current = false
    } else {
      // User has scrolled up
      userHasScrolledUp.current = true
    }
  }

  const handleSendMessage = () => {
    if ((newMessage.trim() || uploadedFiles.length > 0) && selectedChat) {
      const conversations = JSON.parse(localStorage.getItem('conversations') || '[]')
      const convIndex = conversations.findIndex(c => c.id === selectedChat)

      if (convIndex !== -1) {
        const conv = conversations[convIndex]

        if (conv.isGroup) {
          // Group chat: add message to active channel
          const newMsg = {
            id: Date.now(),
            sender: cleanCurrentUsername,
            text: newMessage,
            timestamp: new Date().toISOString(),
            reactions: {},
            files: uploadedFiles.length > 0 ? uploadedFiles : undefined
          }

          if (!conv.messages[activeChannel]) {
            conv.messages[activeChannel] = []
          }
          conv.messages[activeChannel].push(newMsg)

          // Update local state for group
          setMessages(prev => ({
            ...prev,
            [selectedChat]: {
              ...(prev[selectedChat] || {}),
              [activeChannel]: [...(prev[selectedChat]?.[activeChannel] || []), newMsg]
            }
          }))
        } else {
          // DM: add message to messages array
          const newMsg = {
            id: Date.now(),
            sender: cleanCurrentUsername,
            message: newMessage,
            timestamp: Date.now(),
            read: false,
            files: uploadedFiles.length > 0 ? uploadedFiles : undefined
          }

          if (!Array.isArray(conv.messages)) {
            conv.messages = []
          }
          conv.messages.push(newMsg)

          // Update local state for DM
          setMessages(prev => ({
            ...prev,
            [selectedChat]: [...(prev[selectedChat] || []), { ...newMsg, isMe: true }]
          }))
        }

        localStorage.setItem('conversations', JSON.stringify(conversations))

        // Update last message in chat list
        setChats(prev => prev.map(c => {
          if (c.id === selectedChat) {
            return { ...c, lastMessage: newMessage, timestamp: Date.now() }
          }
          return c
        }).sort((a, b) => b.timestamp - a.timestamp))

        setNewMessage("")
        setUploadedFiles([])
        setShowEmojiPicker(false)
        setShowFileMenu(false)
      }
    }
  }

  // ======= Call / Video handlers (basic local preview + controls) =======
  const startCall = async (type = 'voice') => {
    setCallType(type)
    try {
      const constraints = { audio: true, video: type === 'video' }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support audio/video calls.')
        return
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setLocalStream(stream)
      setShowCallModal(true)
      setIsMuted(false)
      setCameraOff(type !== 'video')
      setCallSeconds(0)
      // attach to local video element
      setTimeout(() => {
        if (localVideoRef.current) {
          try { localVideoRef.current.srcObject = stream } catch (e) { console.error(e) }
        }
      }, 50)

      // --- Setup in-browser signaling using BroadcastChannel (same-origin, multi-tab demo) ---
      const chatKey = selectedChat || 'global'
      const channelName = `webrtc-${chatKey}`
      try {
        if (channelRef.current) channelRef.current.close()
        channelRef.current = new BroadcastChannel(channelName)
      } catch (e) {
        console.warn('BroadcastChannel not available', e)
        channelRef.current = null
      }

      // Create RTCPeerConnection
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      })
      pcRef.current = pc

      // When remote track arrives, set remote stream
      const remoteStreamObj = new MediaStream()
      pc.addEventListener('track', (event) => {
        event.streams?.forEach(s => s.getTracks().forEach(t => remoteStreamObj.addTrack(t)))
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStreamObj
        setRemoteStream(remoteStreamObj)
      })

      // ICE candidates -> broadcast
      pc.onicecandidate = (e) => {
        if (e.candidate && channelRef.current) {
          channelRef.current.postMessage({
            kind: 'ice',
            candidate: e.candidate,
            from: localIdRef.current
          })
        }
      }

      // connection state
      pc.onconnectionstatechange = () => {
        const state = pc.connectionState
        setIsCallConnected(state === 'connected' || state === 'completed')
      }

      // Add local tracks
      stream.getTracks().forEach(track => pc.addTrack(track, stream))

      // Listen for incoming signaling messages
      if (channelRef.current) {
        channelRef.current.onmessage = async (ev) => {
          const msg = ev.data
          if (!msg || msg.from === localIdRef.current) return

          try {
            if (msg.kind === 'offer') {
              // If we receive an offer, set as remote, create answer
              await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
              const answer = await pc.createAnswer()
              await pc.setLocalDescription(answer)
              channelRef.current.postMessage({ kind: 'answer', sdp: pc.localDescription, from: localIdRef.current })
            } else if (msg.kind === 'answer') {
              await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
            } else if (msg.kind === 'ice' && msg.candidate) {
              await pc.addIceCandidate(new RTCIceCandidate(msg.candidate))
            }
          } catch (err) {
            console.error('Signaling handling error', err)
          }
        }
      }

      // Initiate call as caller by creating offer
      try {
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        if (channelRef.current) channelRef.current.postMessage({ kind: 'offer', sdp: pc.localDescription, from: localIdRef.current })
      } catch (err) {
        console.warn('Offer create error', err)
      }
    } catch (err) {
      console.error('getUserMedia error', err)
      alert('Could not access microphone/camera. Please allow permissions.')
    }
  }

  const endCall = () => {
    // Stop local tracks
    if (localStream) {
      localStream.getTracks().forEach(t => t.stop())
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(t => t.stop())
    }
    setLocalStream(null)
    setRemoteStream(null)
    setShowCallModal(false)
    setCallType(null)
    setIsMuted(false)
    setCameraOff(false)
    setCallSeconds(0)
    setIsCallConnected(false)
    // Close peer connection and broadcast channel if present
    try {
      if (pcRef.current) {
        try { pcRef.current.close() } catch (e) { /* ignore */ }
        pcRef.current = null
      }
      if (channelRef.current) {
        try { channelRef.current.close() } catch (e) { /* ignore */ }
        channelRef.current = null
      }
    } catch (e) { console.warn('Error during endCall cleanup', e) }
    if (localVideoRef.current) localVideoRef.current.srcObject = null
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null
  }

  const toggleMute = () => {
    if (!localStream) return
    const audioTracks = localStream.getAudioTracks()
    audioTracks.forEach(t => (t.enabled = !t.enabled))
    setIsMuted(prev => !prev)
  }

  const toggleCamera = () => {
    if (!localStream) return
    const videoTracks = localStream.getVideoTracks()
    if (videoTracks.length === 0) return
    videoTracks.forEach(t => (t.enabled = !t.enabled))
    setCameraOff(prev => !prev)
  }

  // Invite another user to the current call (placeholder behaviour)
  const addParticipant = () => {
    const username = prompt('Invite user by username (e.g. @alice)')
    if (!username) return
    const notif = {
      type: 'call_invite',
      title: 'Call Invitation',
      message: `${cleanCurrentUsername} invited ${username} to join the call.`,
      timestamp: new Date().toISOString()
    }
    // Persist notification and trigger alert
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
    notifications.unshift({ ...notif, id: Date.now(), read: false })
    localStorage.setItem('notifications', JSON.stringify(notifications))
    window.dispatchEvent(new CustomEvent('newNotification', { detail: notif }))
    alert(`Invite sent to ${username}`)
  }

  // Call timer
  useEffect(() => {
    let timer
    if (showCallModal) {
      timer = setInterval(() => setCallSeconds(s => s + 1), 1000)
    }
    return () => clearInterval(timer)
  }, [showCallModal])

  const formatCallTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const handleDeleteMessage = (messageId) => {
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]')
    const convIndex = conversations.findIndex(c => c.id === selectedChat)

    if (convIndex !== -1) {
      const conv = conversations[convIndex]

      if (conv.isGroup) {
        // Group chat: delete from active channel
        if (conv.messages[activeChannel]) {
          conv.messages[activeChannel] = conv.messages[activeChannel].filter(m => m.id !== messageId)
          localStorage.setItem('conversations', JSON.stringify(conversations))

          // Update local state
          setMessages(prev => ({
            ...prev,
            [selectedChat]: {
              ...prev[selectedChat],
              [activeChannel]: prev[selectedChat][activeChannel].filter(m => m.id !== messageId)
            }
          }))
        }
      } else {
        // DM: delete from messages array
        conv.messages = conv.messages.filter(m => m.id !== messageId)
        localStorage.setItem('conversations', JSON.stringify(conversations))

        // Update local state
        setMessages(prev => ({
          ...prev,
          [selectedChat]: prev[selectedChat].filter(m => m.id !== messageId)
        }))
      }

      setMessageMenuOpen(null)
      loadConversations()
    }
  }

  const handleEditMessage = (msg) => {
    setEditingMessage(msg.id)
    setEditMessageText(msg.message || msg.text)
    setMessageMenuOpen(null)
  }

  const handleSaveEdit = (messageId) => {
    if (!editMessageText.trim()) return

    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]')
    const convIndex = conversations.findIndex(c => c.id === selectedChat)

    if (convIndex !== -1) {
      const conv = conversations[convIndex]

      if (conv.isGroup) {
        // Group chat: edit in active channel
        if (conv.messages[activeChannel]) {
          const msgIndex = conv.messages[activeChannel].findIndex(m => m.id === messageId)
          if (msgIndex !== -1) {
            conv.messages[activeChannel][msgIndex].text = editMessageText
            conv.messages[activeChannel][msgIndex].edited = true
            localStorage.setItem('conversations', JSON.stringify(conversations))

            // Update local state
            setMessages(prev => ({
              ...prev,
              [selectedChat]: {
                ...prev[selectedChat],
                [activeChannel]: prev[selectedChat][activeChannel].map(m =>
                  m.id === messageId ? { ...m, text: editMessageText, edited: true } : m
                )
              }
            }))
          }
        }
      } else {
        // DM: edit in messages array
        const msgIndex = conv.messages.findIndex(m => m.id === messageId)
        if (msgIndex !== -1) {
          conv.messages[msgIndex].message = editMessageText
          conv.messages[msgIndex].edited = true
          localStorage.setItem('conversations', JSON.stringify(conversations))

          // Update local state
          setMessages(prev => ({
            ...prev,
            [selectedChat]: prev[selectedChat].map(m =>
              m.id === messageId ? { ...m, message: editMessageText, edited: true } : m
            )
          }))
        }
      }

      setEditingMessage(null)
      setEditMessageText("")
      loadConversations()
    }
  }

  const handleReactToMessage = (messageId, emoji) => {
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]')
    const convIndex = conversations.findIndex(c => c.id === selectedChat)

    if (convIndex !== -1) {
      const msgIndex = conversations[convIndex].messages.findIndex(m => m.id === messageId)
      if (msgIndex !== -1) {
        if (!conversations[convIndex].messages[msgIndex].reactions) {
          conversations[convIndex].messages[msgIndex].reactions = {}
        }

        const reactions = conversations[convIndex].messages[msgIndex].reactions
        reactions[emoji] = (reactions[emoji] || 0) + 1

        localStorage.setItem('conversations', JSON.stringify(conversations))
        loadConversations()
      }
    }
    setMessageMenuOpen(null)
  }

  const handleDeleteConversation = () => {
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]')
    const updated = conversations.filter(c => c.id !== selectedChat)
    localStorage.setItem('conversations', JSON.stringify(updated))

    setSelectedChat(null)
    setShowDeleteConversation(false)
    loadConversations()
  }

  // Create new channel
  const handleCreateChannel = () => {
    if (!newChannelName.trim() || !currentChat?.isGroup) return

    const channelId = newChannelName.toLowerCase().replace(/\s+/g, '-')
    const newChannel = {
      id: channelId,
      name: newChannelName,
      icon: '💬'
    }

    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]')
    const convIndex = conversations.findIndex(c => c.id === selectedChat)

    if (convIndex !== -1) {
      // Add new channel
      if (!conversations[convIndex].channels) {
        conversations[convIndex].channels = []
      }
      conversations[convIndex].channels.push(newChannel)

      // Initialize messages for new channel
      if (!conversations[convIndex].messages[channelId]) {
        conversations[convIndex].messages[channelId] = []
      }

      localStorage.setItem('conversations', JSON.stringify(conversations))
      setNewChannelName("")
      setShowCreateChannel(false)
      loadConversations()
    }
  }

  // Insert emoji at cursor
  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  // Handle file upload
  const handleFileSelect = (type) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : '*'
      fileInputRef.current.click()
    }
    setShowFileMenu(false)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: reader.result, // Base64 data
        url: reader.result
      }
      setUploadedFiles(prev => [...prev, fileData])

      // Add file reference to message
      const fileEmoji = file.type.startsWith('image/') ? '🖼️' : file.type.startsWith('video/') ? '🎥' : '📎'
      setNewMessage(prev => prev + `${fileEmoji} ${file.name}`)
    }

    reader.readAsDataURL(file)
    e.target.value = '' // Reset input
  }

  // Handle voice recording
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks = []
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onloadend = () => {
          setNewMessage(prev => prev + '🎤 Voice Message')
          setUploadedFiles(prev => [...prev, {
            name: 'voice-message.webm',
            type: 'audio/webm',
            data: reader.result,
            url: reader.result,
            isVoice: true
          }])
        }
        reader.readAsDataURL(blob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Failed to start recording:', err)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      // Message will be sent automatically after the audio is processed
      setTimeout(() => {
        if (newMessage || uploadedFiles.length > 0) {
          handleSendMessage()
        }
      }, 500)
    }
  }

  // Handle mentions
  const handleMessageChange = (e) => {
    const value = e.target.value
    setNewMessage(value)

    // Check for @ mentions
    const cursorPos = e.target.selectionStart
    const textBeforeCursor = value.substring(0, cursorPos)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')

    if (lastAtIndex !== -1 && lastAtIndex === cursorPos - 1) {
      setShowMentions(true)
      setMentionSearch('')
    } else if (lastAtIndex !== -1 && !textBeforeCursor.substring(lastAtIndex).includes(' ')) {
      const search = textBeforeCursor.substring(lastAtIndex + 1)
      setMentionSearch(search)
      setShowMentions(true)
    } else {
      setShowMentions(false)
    }
  }

  const handleSelectMention = (member) => {
    const cursorPos = messageInputRef.current?.selectionStart || newMessage.length
    const textBeforeCursor = newMessage.substring(0, cursorPos)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')

    const beforeMention = newMessage.substring(0, lastAtIndex)
    const afterCursor = newMessage.substring(cursorPos)
    const mention = `@${member.username.replace('@', '')} `

    setNewMessage(beforeMention + mention + afterCursor)
    setShowMentions(false)
    setMentionSearch('')

    // Focus back on input
    setTimeout(() => messageInputRef.current?.focus(), 0)
  }

  // Get filtered members for mentions
  const getMentionMembers = () => {
    if (!currentChat?.isGroup) return []
    const members = currentChat.members || []
    if (!mentionSearch) return members
    return members.filter(m =>
      m.name.toLowerCase().includes(mentionSearch.toLowerCase()) ||
      m.username.toLowerCase().includes(mentionSearch.toLowerCase())
    )
  }

  // Navigate to member DM
  const handleMemberClick = (member) => {
    const memberUsername = member.username.startsWith('@') ? member.username.substring(1) : member.username

    // Find existing DM
    const existingDM = chats.find(chat =>
      !chat.isGroup &&
      (chat.username === memberUsername || chat.username === `@${memberUsername}`)
    )

    if (existingDM) {
      setSelectedChat(existingDM.id)
    } else {
      // Create new DM
      const conversations = JSON.parse(localStorage.getItem('conversations') || '[]')
      const newConv = {
        id: Date.now().toString(),
        participants: [cleanCurrentUsername, memberUsername],
        messages: [],
        createdAt: Date.now()
      }
      conversations.push(newConv)
      localStorage.setItem('conversations', JSON.stringify(conversations))
      loadConversations()
      setTimeout(() => setSelectedChat(newConv.id), 100)
    }
  }

  // Remove member (leader only)
  const handleRemoveMember = (member) => {
    if (!currentChat?.isGroup) return

    const currentUserMember = currentChat.members?.find(m =>
      m.username === cleanCurrentUsername || m.username === `@${cleanCurrentUsername}`
    )

    if (currentUserMember?.role !== 'leader') {
      alert('Only team leaders can remove members')
      return
    }

    if (confirm(`Remove ${member.name} from the team?`)) {
      const conversations = JSON.parse(localStorage.getItem('conversations') || '[]')
      const convIndex = conversations.findIndex(c => c.id === selectedChat)

      if (convIndex !== -1) {
        conversations[convIndex].members = conversations[convIndex].members.filter(
          m => m.username !== member.username
        )
        localStorage.setItem('conversations', JSON.stringify(conversations))

        // Also update team
        const teams = JSON.parse(localStorage.getItem('teams') || '[]')
        const teamIndex = teams.findIndex(t => t.id === currentChat.teamId)
        if (teamIndex !== -1) {
          teams[teamIndex].acceptedMembers = teams[teamIndex].acceptedMembers.filter(
            m => m !== member.username && m !== `@${member.username}`
          )
          localStorage.setItem('teams', JSON.stringify(teams))
        }

        loadConversations()
      }
    }
    setMemberMenuOpen(null)
  }

  const currentChat = chats.find(c => c.id === selectedChat)

  // Get current messages based on chat type
  let currentMessages = []
  if (selectedChat && currentChat) {
    if (currentChat.isGroup) {
      // For group chats, get messages from active channel
      const channelMessages = messages[selectedChat]?.[activeChannel] || []
      currentMessages = Array.isArray(channelMessages) ? channelMessages.map(msg => ({
        ...msg,
        isMe: msg.sender === cleanCurrentUsername || msg.sender === `@${cleanCurrentUsername}`
      })) : []
    } else {
      // For DMs, get messages array
      currentMessages = messages[selectedChat] || []
    }

    // Filter by search query
    if (searchQuery.trim()) {
      currentMessages = currentMessages.filter(msg =>
        (msg.message || msg.text || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Render message text with mentions highlighted
  const renderMessageText = (text) => {
    if (!text) return null
    const mentionRegex = /@(\w+)/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = mentionRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }
      parts.push(
        <span key={match.index} className="bg-blue-500/20 text-blue-300 px-1 rounded">
          {match[0]}
        </span>
      )
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : text
  }

  // Handle audio play/pause
  const handleAudioPlayPause = (audioId, audioUrl) => {
    const audio = audioRefs.current[audioId]

    if (!audio) {
      // Create new audio element
      const newAudio = new Audio(audioUrl)
      audioRefs.current[audioId] = newAudio

      newAudio.addEventListener('ended', () => {
        setPlayingAudio(null)
        setAudioProgress(prev => ({ ...prev, [audioId]: 0 }))
      })

      // Track audio progress
      newAudio.addEventListener('timeupdate', () => {
        const progress = (newAudio.currentTime / newAudio.duration) * 100
        setAudioProgress(prev => ({ ...prev, [audioId]: progress || 0 }))
      })

      // Track duration when loaded
      newAudio.addEventListener('loadedmetadata', () => {
        setAudioDurations(prev => ({ ...prev, [audioId]: newAudio.duration }))
      })

      newAudio.play()
      setPlayingAudio(audioId)
    } else {
      if (playingAudio === audioId) {
        audio.pause()
        setPlayingAudio(null)
      } else {
        audio.play()
        setPlayingAudio(audioId)
      }
    }
  }

  // Format time for audio display (seconds to MM:SS)
  const formatAudioTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Get current time for playing audio
  const getCurrentTime = (audioId) => {
    const audio = audioRefs.current[audioId]
    if (audio && playingAudio === audioId) {
      return formatAudioTime(audio.currentTime)
    }
    return '0:00'
  }

  // Render file attachments
  const renderFiles = (files, messageId) => {
    if (!files || files.length === 0) return null

    return files.map((file, index) => {
      const isImage = file.type?.startsWith('image/')
      const isVideo = file.type?.startsWith('video/')
      const isAudio = file.type?.startsWith('audio/') || file.isVoice

      return (
        <div key={index} className="mt-2">
          {isImage && (
            <div
              onClick={() => setExpandedMedia({ type: 'image', url: file.url || file.data, name: file.name })}
              className="block cursor-pointer group relative"
            >
              <img
                src={file.url || file.data}
                alt={file.name}
                className="max-w-sm max-h-64 rounded-lg transition-all group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-all flex items-center justify-center">
                <svg className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m0 0v6m0-6h6m-6 0H4" />
                </svg>
              </div>
            </div>
          )}
          {isVideo && (
            <div
              onClick={() => setExpandedMedia({ type: 'video', url: file.url || file.data, name: file.name })}
              className="relative cursor-pointer group"
            >
              <video
                src={file.url || file.data}
                className="max-w-sm max-h-64 rounded-lg"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-all flex items-center justify-center">
                <svg className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-all" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
              </div>
            </div>
          )}
          {isAudio && (
            <div className={`flex items-center gap-2 rounded-lg px-3 py-2 max-w-xs ${file.isVoice
              ? 'bg-green-500/10 border border-green-500/30'
              : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20'
              }`}>
              {/* Play/Pause button - WhatsApp style */}
              <button
                onClick={() => handleAudioPlayPause(`${messageId}-${index}`, file.url || file.data)}
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${file.isVoice
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-blue-500 hover:bg-blue-600'
                  }`}
              >
                {playingAudio === `${messageId}-${index}` ? (
                  /* Pause icon */
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  /* Play icon */
                  <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                )}
              </button>

              {/* Waveform visualization - WhatsApp style with progress */}
              <div className="flex-1 flex items-center gap-0.5 h-10 relative">
                {[3, 6, 4, 8, 5, 9, 4, 7, 3, 6, 8, 5, 7, 4, 6, 3, 8, 5, 7, 4, 6, 9, 3, 7, 5, 8, 4, 6].map((height, i) => {
                  const audioId = `${messageId}-${index}`
                  const progress = audioProgress[audioId] || 0
                  const barProgress = (i / 28) * 100
                  const isPlayed = barProgress <= progress

                  return (
                    <div
                      key={i}
                      className={`w-0.5 rounded-full transition-all ${isPlayed
                        ? (file.isVoice ? 'bg-green-500' : 'bg-blue-500')
                        : (file.isVoice ? 'bg-green-500/60' : 'bg-blue-500/60')
                        }`}
                      style={{ height: `${height * 3}px` }}
                    ></div>
                  )
                })}
              </div>

              {/* Duration text - shows current time / total time */}
              <span className={`text-xs font-medium tabular-nums ${file.isVoice ? 'text-green-400' : 'text-blue-400'
                }`}>
                {playingAudio === `${messageId}-${index}`
                  ? getCurrentTime(`${messageId}-${index}`)
                  : formatAudioTime(audioDurations[`${messageId}-${index}`] || 0)
                }
              </span>
            </div>
          )}
          {!isImage && !isVideo && !isAudio && (
            <a
              href={file.url || file.data}
              download={file.name}
              className="flex items-center gap-3 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 rounded-lg px-4 py-3 transition cursor-pointer max-w-sm group"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-neutral-700 rounded-lg group-hover:bg-blue-500/20 transition">
                <svg className="w-5 h-5 text-neutral-400 group-hover:text-blue-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate text-neutral-200">{file.name}</div>
                <div className="text-xs text-neutral-500">
                  {(file.size / 1024).toFixed(1)} KB
                </div>
              </div>
              <svg className="w-5 h-5 text-neutral-500 group-hover:text-blue-400 transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          )}
        </div>
      )
    })
  }

  return (
    <>
      <div className="flex h-[calc(100vh-200px)] overflow-visible">
        {/* Server/Chat List - Left Sidebar */}
        <div className="w-20 bg-neutral-950 flex flex-col items-center border-r border-neutral-800 overflow-visible">
          <div className="h-full w-full overflow-y-auto flex flex-col items-center py-4 gap-2">
            {chats.map((chat) => (
              <div key={chat.id} className="relative group/chat">
                <button
                  onClick={() => {
                    setSelectedChat(chat.id)
                    if (chat.isGroup) {
                      setActiveChannel('general')
                    }
                  }}
                  className={`w-12 h-12 rounded-2xl transition-all ${selectedChat === chat.id
                    ? "rounded-xl bg-blue-500 ring-2 ring-blue-400"
                    : "bg-neutral-800 hover:bg-blue-500 hover:rounded-xl"
                    } flex items-center justify-center relative`}
                >
                  {chat.isGroup ? (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg group-hover/chat:rounded-xl transition-all">
                      {chat.name.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <img src={chat.avatar} alt={chat.name} className="w-full h-full rounded-2xl object-cover group-hover/chat:rounded-xl transition-all" />
                  )}
                  {chat.unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {chat.unread > 9 ? '9+' : chat.unread}
                    </span>
                  )}
                </button>

                {/* Name tooltip on hover */}
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover/chat:opacity-100 pointer-events-none transition-all duration-200 z-[9999]">
                  <div className="bg-neutral-800 text-white px-3 py-2 rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {!chat.isGroup && (
                        <img src={chat.avatar} alt={chat.name} className="w-6 h-6 rounded-full" />
                      )}
                      <div>
                        <p className="font-semibold text-sm">{chat.name}</p>
                        {!chat.isGroup && chat.username && (
                          <p className="text-xs text-neutral-400">{chat.username}</p>
                        )}
                      </div>
                    </div>
                    {chat.lastMessage && (
                      <p className="text-xs text-neutral-400 mt-1 max-w-xs truncate">
                        {chat.lastMessage}
                      </p>
                    )}
                  </div>
                  {/* Arrow */}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-neutral-800"></div>
                </div>
              </div>
            ))}
          </div>

          {chats.length === 0 && (
            <div className="text-neutral-600 text-center text-xs mt-4 px-2">
              No chats
            </div>
          )}
        </div>

        {/* Channels Sidebar - Only for Group Chats */}
        {selectedChat && currentChat?.isGroup && (
          <div className="w-60 bg-neutral-900 flex flex-col border-r border-neutral-800 overflow-visible">
            {/* Server Name */}
            <div className="h-12 border-b border-neutral-800 px-4 flex items-center justify-between cursor-pointer transition flex-shrink-0">
              <h2 className="text-white font-bold truncate">{currentChat.name}</h2>
              <svg className="w-4 h-4 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Channels List */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-2">
                <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Text Channels</span>
                  <button
                    onClick={() => setShowCreateChannel(true)}
                    className="text-neutral-400 hover:text-white transition"
                    title="Create Channel"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {currentChat.channels?.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded mb-0.5 transition ${activeChannel === channel.id
                      ? "bg-neutral-700 text-white"
                      : "text-neutral-400"
                      }`}
                  >
                    <span className="text-lg">{channel.icon}</span>
                    <span className="text-sm font-medium">{channel.name}</span>
                  </button>
                ))}
              </div>

              {/* Voice Channels Section */}
              <div className="px-2 mt-4">
                <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Voice Channels</span>
                </div>

                <button
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition ${isRecording
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                    }`}
                >
                  <svg className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1 text-left">
                    <span className="text-sm font-medium">General Voice</span>
                    {isRecording && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                        <span className="text-xs text-green-300">Recording...</span>
                      </div>
                    )}
                  </div>
                  {isRecording && (
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        <div className="w-1 h-3 bg-green-400 rounded animate-pulse" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1 h-4 bg-green-400 rounded animate-pulse" style={{ animationDelay: '100ms' }}></div>
                        <div className="w-1 h-5 bg-green-400 rounded animate-pulse" style={{ animationDelay: '200ms' }}></div>
                        <div className="w-1 h-4 bg-green-400 rounded animate-pulse" style={{ animationDelay: '300ms' }}></div>
                        <div className="w-1 h-3 bg-green-400 rounded animate-pulse" style={{ animationDelay: '400ms' }}></div>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* User Info at Bottom */}
            <div className="h-14 bg-neutral-950 px-2 flex items-center gap-2 border-t border-neutral-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                {currentUser.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{currentUser.name || 'User'}</div>
                <div className="text-neutral-400 text-xs truncate">Online</div>
              </div>
              <button className="text-neutral-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 relative overflow-visible min-w-0">
          {/* Animated background gradient */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative z-10 flex flex-col flex-1 min-h-0 overflow-visible">{selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="h-12 border-b border-neutral-800 px-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  {currentChat?.isGroup ? (
                    <>
                      <span className="text-xl">{currentChat.channels?.find(c => c.id === activeChannel)?.icon || '💬'}</span>
                      <div>
                        <h3 className="text-white font-semibold">{currentChat.channels?.find(c => c.id === activeChannel)?.name || 'general'}</h3>
                      </div>
                    </>
                  ) : (
                    <>
                      <img src={currentChat?.avatar} alt={currentChat?.name} className="w-8 h-8 rounded-full ring-2 ring-neutral-700" />
                      <div>
                        <h3 className="text-white font-semibold">{currentChat?.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-neutral-400">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span>Online</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Toolbar Icons */}
                  <button onClick={() => startCall('voice')} className="p-2 text-neutral-400 hover:text-white transition" title="Voice Call">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                  <button onClick={() => startCall('video')} className="p-2 text-neutral-400 hover:text-white transition" title="Video Call">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowSearchBar(!showSearchBar)}
                    className={`p-2 transition ${showSearchBar ? 'text-blue-400' : 'text-neutral-400 hover:text-white'}`}
                    title="Search Messages"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  {!currentChat?.isGroup && (
                    <button
                      onClick={() => setShowDeleteConversation(true)}
                      className="p-2 text-neutral-400 hover:text-red-400 transition"
                      title="Delete Conversation"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Search Bar */}
              {showSearchBar && (
                <div className="px-4 py-3 bg-neutral-800 border-b border-neutral-700 flex-shrink-0">
                  <div className="flex items-center gap-2 bg-neutral-900 rounded px-3 py-2">
                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-neutral-500"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-neutral-400 hover:text-white transition"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {searchQuery && (
                    <div className="text-xs text-neutral-400 mt-2">
                      Found {currentMessages.length} result{currentMessages.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              )}

              {/* Messages Area */}
              <div
                className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4"
                onScroll={handleScroll}
                style={{
                  scrollBehavior: 'smooth',
                  overscrollBehavior: 'contain',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {currentMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-neutral-500">
                    <div className="text-center">
                      <div className="text-4xl mb-2">�</div>
                      <p className="text-sm">Start the conversation with {currentChat?.name}!</p>
                    </div>
                  </div>
                ) : (
                  currentMessages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''} group animate-in fade-in slide-in-from-bottom-3 duration-300`}>
                      {!msg.isMe && (
                        <img
                          src={currentChat?.isGroup
                            ? currentChat.members?.find(m => m.username === msg.sender || m.username === `@${msg.sender}`)?.avatar
                            : currentChat?.avatar
                          }
                          alt={msg.sender}
                          className="w-10 h-10 rounded-full flex-shrink-0 ring-2 ring-neutral-800"
                        />
                      )}
                      <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-[70%] relative`}>
                        {/* Show sender name in group chats */}
                        {!msg.isMe && currentChat?.isGroup && (
                          <div className="flex items-center gap-2 mb-1 px-1">
                            <span className="text-sm font-semibold text-blue-400">
                              {currentChat.members?.find(m => m.username === msg.sender || m.username === `@${msg.sender}`)?.name || msg.sender}
                            </span>
                            <span className="text-xs text-neutral-500">
                              {formatTimestamp(msg.timestamp)}
                            </span>
                          </div>
                        )}

                        {editingMessage === msg.id ? (
                          <div className="w-full">
                            <input
                              type="text"
                              value={editMessageText}
                              onChange={(e) => setEditMessageText(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(msg.id)}
                              className="w-full bg-neutral-800 border border-neutral-600 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                              autoFocus
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleSaveEdit(msg.id)}
                                className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingMessage(null)
                                  setEditMessageText("")
                                }}
                                className="px-4 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium rounded-lg transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className={`px-4 py-2.5 rounded-2xl relative shadow-lg transition-all duration-200 ${msg.isMe
                              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                              : 'bg-neutral-800 text-neutral-100 border border-neutral-700/50'
                              }`}>
                              <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                                {renderMessageText(msg.message || msg.text)}
                              </p>
                              {msg.edited && (
                                <span className="text-xs opacity-60 ml-2 italic">(edited)</span>
                              )}

                              {/* Render file attachments */}
                              {renderFiles(msg.files, msg.id)}

                              {/* Message Menu Button - Only for own messages */}
                              {msg.isMe && (
                                <div className="message-menu-container">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setMessageMenuOpen(messageMenuOpen === msg.id ? null : msg.id)
                                    }}
                                    className="absolute -right-10 top-2 p-2.5 bg-gradient-to-br from-neutral-700/90 to-neutral-800/90 hover:from-neutral-600/90 hover:to-neutral-700/90 backdrop-blur-sm rounded-xl transition-all duration-300 shadow-xl border border-neutral-600/50 opacity-0 group-hover:opacity-100 hover:scale-110 hover:rotate-12"
                                  >
                                    <svg className="w-4 h-4 text-neutral-200" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Message Options Menu - Positioned at TOP */}
                            {messageMenuOpen === msg.id && msg.isMe && (
                              <div className="message-menu-container absolute right-0 bottom-full mb-2 bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-800 border-2 border-neutral-700/80 rounded-2xl shadow-2xl z-[9999] py-2 min-w-56 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
                                {/* Glowing border effect */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-50 blur-xl"></div>

                                <div className="relative z-10">
                                  <button
                                    onClick={() => handleEditMessage(msg)}
                                    className="w-full px-5 py-3 text-left text-sm text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 flex items-center gap-3 transition-all duration-200 group/item"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-200">
                                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                    </div>
                                    <span className="font-semibold group-hover/item:text-blue-300 transition-colors">Edit Message</span>
                                  </button>

                                  <button
                                    onClick={() => handleDeleteMessage(msg.id)}
                                    className="w-full px-5 py-3 text-left text-sm text-white hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20 flex items-center gap-3 transition-all duration-200 group/item"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-200">
                                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </div>
                                    <span className="font-semibold group-hover/item:text-red-300 transition-colors">Delete Message</span>
                                  </button>

                                  <div className="relative my-2">
                                    <div className="absolute inset-0 flex items-center">
                                      <div className="w-full border-t border-gradient-to-r from-transparent via-neutral-700 to-transparent"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                      <span className="px-3 bg-neutral-900 text-xs text-neutral-400 font-bold uppercase tracking-widest">Quick React</span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-4 gap-2 px-3 py-2">
                                    {['👍', '❤️', '😂', '🎉'].map(emoji => (
                                      <button
                                        key={emoji}
                                        onClick={() => handleReactToMessage(msg.id, emoji)}
                                        className="text-2xl hover:scale-125 hover:-translate-y-1 transition-all duration-200 hover:bg-gradient-to-br hover:from-neutral-700/50 hover:to-neutral-600/50 rounded-xl p-2 hover:shadow-lg hover:shadow-blue-500/20"
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Bottom arrow pointing to message */}
                                <div className="absolute bottom-0 right-8 translate-y-full">
                                  <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-neutral-800"></div>
                                </div>
                              </div>
                            )}

                            {/* Reactions Display */}
                            {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                              <div className="flex gap-2 mt-2">
                                {Object.entries(msg.reactions).map(([emoji, count]) => (
                                  <span key={emoji} className="text-xs bg-neutral-800 border border-neutral-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                                    <span className="text-sm">{emoji}</span>
                                    <span className="text-neutral-400 font-medium">{count}</span>
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Timestamp for own messages */}
                            {msg.isMe && (
                              <span className="text-neutral-500 text-xs mt-1">{formatTimestamp(msg.timestamp)}</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="px-4 pb-6 pt-4 flex-shrink-0">
                <div className="flex items-center gap-2 bg-gradient-to-r from-neutral-700/50 via-neutral-700/40 to-neutral-700/50 backdrop-blur-xl rounded-2xl px-4 py-3 relative border border-neutral-600/30 shadow-xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-blue-500/10 focus-within:border-blue-500/50 focus-within:shadow-blue-500/20">
                  <div className="relative">
                    <button
                      onClick={() => setShowFileMenu(!showFileMenu)}
                      className="text-neutral-400 hover:text-white transition"
                      title="Attach File"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {/* File Menu */}
                    {showFileMenu && (
                      <div className="absolute bottom-full left-0 mb-2 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg py-2 min-w-48 z-20">
                        <button
                          onClick={() => handleFileSelect('image')}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-neutral-700 flex items-center gap-3"
                        >
                          <span className="text-lg">🖼️</span>
                          <span>Upload Image</span>
                        </button>
                        <button
                          onClick={() => handleFileSelect('video')}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-neutral-700 flex items-center gap-3"
                        >
                          <span className="text-lg">🎥</span>
                          <span>Upload Video</span>
                        </button>
                        <button
                          onClick={() => handleFileSelect('file')}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-neutral-700 flex items-center gap-3"
                        >
                          <span className="text-lg">📎</span>
                          <span>Upload File</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 relative">
                    <input
                      ref={messageInputRef}
                      type="text"
                      placeholder={`Message ${currentChat?.isGroup ? '#' + (currentChat.channels?.find(c => c.id === activeChannel)?.name || 'general') : currentChat?.name}`}
                      value={newMessage}
                      onChange={handleMessageChange}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          if (!showMentions) {
                            handleSendMessage()
                          }
                        }
                      }}
                      className="w-full bg-transparent border-none outline-none text-white placeholder-neutral-500"
                    />

                    {/* Mentions Dropdown */}
                    {showMentions && currentChat?.isGroup && (
                      <div className="absolute bottom-full left-0 mb-2 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg py-2 max-w-xs w-64 z-30">
                        <div className="px-3 py-2 text-xs text-neutral-400 font-semibold uppercase">Mention</div>
                        <div className="max-h-48 overflow-y-auto">
                          {getMentionMembers().map(member => (
                            <button
                              key={member.username}
                              onClick={() => handleSelectMention(member)}
                              className="w-full px-3 py-2 text-left hover:bg-neutral-700 flex items-center gap-2 transition"
                            >
                              <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm text-white truncate">{member.name}</div>
                                <div className="text-xs text-neutral-400">@{member.username.replace('@', '')}</div>
                              </div>
                            </button>
                          ))}
                          {getMentionMembers().length === 0 && (
                            <div className="px-3 py-2 text-sm text-neutral-500">No members found</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Microphone button for voice recording - Professional Design */}
                  <button
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    className={`relative transition-all ${isRecording
                      ? 'bg-red-500 hover:bg-red-600 text-white scale-110'
                      : 'bg-neutral-700 hover:bg-blue-500 text-neutral-300 hover:text-white'
                      } p-2.5 rounded-full shadow-lg`}
                    title={isRecording ? 'Stop Recording' : 'Record Voice Message'}
                  >
                    {isRecording ? (
                      <>
                        {/* Stop icon with recording indicator */}
                        <div className="w-6 h-6 flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-sm"></div>
                        </div>
                        {/* Pulsing ring animation */}
                        <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></span>
                      </>
                    ) : (
                      /* Microphone icon */
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="text-neutral-400 hover:text-white transition"
                      title="Add Emoji"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>

                    {/* Emoji Picker - Expanded */}
                    {showEmojiPicker && (
                      <div className="absolute bottom-full right-0 mb-2 bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-800 border-2 border-neutral-700/80 rounded-2xl shadow-2xl p-4 z-20 w-80 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-300">
                        {/* Glowing effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 opacity-50 blur-xl"></div>

                        <div className="relative z-10">
                          <div className="mb-4">
                            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-widest mb-3">Smileys & Emotions</h4>
                            <div className="grid grid-cols-6 gap-3">
                              {['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😍', '🥰', '😘', '😋', '😎', '🤩', '😏', '😌', '😔', '😢', '😭', '😠', '😡'].map(emoji => (
                                <button
                                  key={emoji}
                                  onClick={() => handleEmojiSelect(emoji)}
                                  className="text-3xl hover:scale-125 hover:-translate-y-1 hover:rotate-12 hover:bg-gradient-to-br hover:from-neutral-700/50 hover:to-neutral-600/50 rounded-xl p-2 transition-all duration-200 hover:shadow-lg"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="mb-4 border-t border-neutral-700/50 pt-4">
                            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-widest mb-3">Gestures & People</h4>
                            <div className="grid grid-cols-6 gap-3">
                              {['👍', '👎', '👌', '✌️', '🤞', '🤟', '👏', '🙌', '🤝', '🙏', '💪', '👋', '🤙', '👊', '✊', '🤚', '👈', '👉'].map(emoji => (
                                <button
                                  key={emoji}
                                  onClick={() => handleEmojiSelect(emoji)}
                                  className="text-3xl hover:scale-125 hover:-translate-y-1 hover:rotate-12 hover:bg-gradient-to-br hover:from-neutral-700/50 hover:to-neutral-600/50 rounded-xl p-2 transition-all duration-200 hover:shadow-lg"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="border-t border-neutral-700/50 pt-4">
                            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-widest mb-3">Hearts & Symbols</h4>
                            <div className="grid grid-cols-6 gap-3">
                              {['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💔', '❣️', '💕', '💖', '💗', '💘', '⭐', '✨', '🔥', '🎉'].map(emoji => (
                                <button
                                  key={emoji}
                                  onClick={() => handleEmojiSelect(emoji)}
                                  className="text-3xl hover:scale-125 hover:-translate-y-1 hover:rotate-12 hover:bg-gradient-to-br hover:from-neutral-700/50 hover:to-neutral-600/50 rounded-xl p-2 transition-all duration-200 hover:shadow-lg"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Bottom arrow */}
                        <div className="absolute bottom-0 right-4 translate-y-full">
                          <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-neutral-800"></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Send Button - Shows when there's content or files */}

                  {/* Send Button - Shows when there's content or files */}
                  {(newMessage.trim() || uploadedFiles.length > 0) && !isRecording && (
                    <button
                      onClick={handleSendMessage}
                      className="relative bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white transition-all duration-300 font-semibold rounded-full p-3 shadow-lg hover:shadow-blue-500/50 hover:scale-110 group/send"
                      title="Send Message"
                    >
                      <svg className="w-5 h-5 transition-transform group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                      <span className="absolute inset-0 rounded-full bg-blue-400 opacity-0 group-hover/send:opacity-20 group-hover/send:animate-ping"></span>
                    </button>
                  )}
                </div>

                {/* Professional Recording Indicator */}
                {isRecording && (
                  <div className="mt-3 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
                    <div className="relative">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-red-400">Recording Voice Message</div>
                      <div className="text-xs text-neutral-400">Click the button again to stop and send</div>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1 h-6 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1 h-8 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                      <div className="w-1 h-6 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></div>
                      <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
                    </div>
                  </div>
                )}

                {/* File preview */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="bg-neutral-800 rounded px-3 py-2 text-sm flex items-center gap-2">
                        <span>{file.isVoice ? '🎤' : file.type?.startsWith('image/') ? '🖼️' : file.type?.startsWith('video/') ? '🎥' : '📎'}</span>
                        <span className="text-neutral-300 truncate max-w-[150px]">{file.name}</span>
                        <button
                          onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                          className="text-neutral-400 hover:text-red-400 transition"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-500 p-4">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-lg">Select a chat to start messaging</p>
                <p className="text-sm text-neutral-600 mt-2">Your conversations will appear on the left</p>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Members Sidebar - Only for Group Chats */}
        {selectedChat && currentChat?.isGroup && (
          <div className="w-60 bg-neutral-900 border-l border-neutral-800 overflow-visible">
            <div className="p-4 overflow-visible">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">
                Members — {currentChat.members?.length || 0}
              </h3>

              <div className="space-y-1">
                {currentChat.members?.map((member) => (
                  <div
                    key={member.username}
                    className="flex items-center gap-3 px-2 py-2 rounded hover:bg-neutral-800/50 transition cursor-pointer group relative"
                  >
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-900"></span>
                    </div>

                    <div
                      className="flex-1 min-w-0"
                      onClick={() => handleMemberClick(member)}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium truncate ${member.role === 'leader' ? 'text-purple-400' : 'text-white'
                          }`}>
                          {member.name}
                        </span>
                        {member.role === 'leader' && (
                          <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs text-neutral-500 capitalize">{member.role || 'Member'}</span>
                    </div>

                    {/* Member Actions on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMemberClick(member)
                        }}
                        className="p-1 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white"
                        title="Message"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </button>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setMemberMenuOpen(memberMenuOpen === member.username ? null : member.username)
                          }}
                          className="p-1 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white"
                          title="More"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>

                        {/* Member Menu */}
                        {memberMenuOpen === member.username && (
                          <div className="absolute right-0 top-8 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-[9999] py-1 min-w-40">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMemberClick(member)
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-neutral-700 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              Message
                            </button>

                            {currentChat.members?.find(m =>
                              (m.username === cleanCurrentUsername || m.username === `@${cleanCurrentUsername}`) &&
                              m.role === 'leader'
                            ) && member.role !== 'leader' && (
                                <>
                                  <div className="border-t border-neutral-700 my-1"></div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleRemoveMember(member)
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-neutral-700 flex items-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                                    </svg>
                                    Remove from Team
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      alert('Block feature coming soon!')
                                      setMemberMenuOpen(null)
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-neutral-700 flex items-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                    Block User
                                  </button>
                                </>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Conversation Modal */}
      {showDeleteConversation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Delete Conversation</h3>
                <p className="text-neutral-400 text-sm">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-neutral-300 mb-6">
              Are you sure you want to delete this conversation with <span className="font-semibold text-white">{currentChat?.name}</span>? All messages will be permanently removed.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConversation(false)}
                className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConversation}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Channel Modal */}
      {showCreateChannel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Create Text Channel</h3>
                <p className="text-neutral-400 text-sm">in {currentChat?.name}</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Channel Name
              </label>
              <input
                type="text"
                placeholder="e.g. announcements"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateChannel()}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition"
                autoFocus
              />
              <p className="text-xs text-neutral-500 mt-2">
                Channel names are lowercase and use dashes instead of spaces
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateChannel(false)
                  setNewChannelName("")
                }}
                className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChannel}
                disabled={!newChannelName.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Channel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call / Video Modal (enhanced UI) */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-6">
          <div className="relative w-full max-w-6xl rounded-3xl p-6">
            {/* AUDIO CALL - centered square */}
            {callType === 'audio' ? (
              <div className="mx-auto w-full max-w-sm sm:max-w-md">
                {/* gradient outline wrapper for a sexy outline */}
                <div className="rounded-2xl p-1 bg-gradient-to-r from-indigo-500/40 via-pink-500/30 to-blue-400/30 shadow-[0_12px_40px_rgba(99,102,241,0.12)]">
                  <div className="relative bg-gradient-to-br from-neutral-900/90 to-neutral-800/80 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center">
                    {/* Avatar square */}
                    <div className="w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl flex items-center justify-center text-white text-6xl font-bold overflow-hidden">
                      {currentChat?.avatar ? (
                        <img src={currentChat.avatar} alt={currentChat.name || currentChat.username} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <div className="uppercase">{currentChat?.name ? currentChat.name.charAt(0) : (currentChat?.username || 'U').charAt(0)}</div>
                      )}
                    </div>

                    <div className="mt-4 text-center">
                      <div className="text-white text-xl font-semibold truncate">{currentChat?.name || currentChat?.username || 'Unknown'}</div>
                      <div className="text-neutral-400 text-sm mt-1">Audio Call • {formatCallTime(callSeconds)}</div>
                    </div>

                    {/* Bottom centered action bar */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-[-34px] flex items-center gap-4 bg-transparent">
                      <button onClick={addParticipant} className="flex items-center justify-center w-12 h-12 bg-neutral-800 text-white rounded-full shadow hover:bg-neutral-700" title="Add people">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v6M21 12h-6M3 7a4 4 0 014-4h0a4 4 0 014 4v1M3 17a4 4 0 004 4h0a4 4 0 004-4v-1" /></svg>
                      </button>

                      <button onClick={toggleMute} className={`flex items-center justify-center w-14 h-14 ${isMuted ? 'bg-red-600' : 'bg-neutral-800'} text-white rounded-lg shadow-lg`} title="Mute/Unmute">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 00-1 1v3.586L4.707 3.293A1 1 0 103.293 4.707L6.586 8H5a1 1 0 00-1 1v2a1 1 0 001 1h2v1a5 5 0 005 5v-2a3 3 0 01-3-3V9h1.586l3.707 3.707A1 1 0 1013.293 13.293L9.707 9.707A1 1 0 009 9V3a1 1 0 00-1-1z" /></svg>
                      </button>

                      <button onClick={() => startCall('video')} className="flex items-center justify-center w-14 h-14 bg-neutral-800 text-white rounded-lg shadow-lg" title="Switch to video">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V8l4 3V5a2 2 0 00-2-2H4z" /></svg>
                      </button>

                      <button onClick={endCall} className="flex items-center justify-center w-16 h-16 bg-red-600 text-white rounded-full shadow-2xl ring-4 ring-red-600/20" title="Hang up">
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.657L10 18.828l-6.828-6.829a4 4 0 010-5.657z" /></svg>
                      </button>
                    </div>

                    {/* spacing to avoid overlap with bottom actions */}
                    <div style={{ height: '56px' }} />
                  </div>
                </div>
              </div>
            ) : (
              /* VIDEO CALL - large main screen with small local overlay */
              <div className="p-1 rounded-2xl bg-gradient-to-r from-indigo-500/30 via-pink-500/25 to-blue-400/25 shadow-[0_18px_60px_rgba(99,102,241,0.10)]">
                <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5">
                  <div className="w-full h-[60vh] bg-black relative">
                    <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover bg-black" />

                    {/* Small local preview in bottom-right */}
                    <div className="absolute right-4 bottom-4 w-36 h-36 sm:w-44 sm:h-44 bg-gradient-to-br from-neutral-900/80 to-neutral-800/60 rounded-xl overflow-hidden border border-neutral-700 shadow-lg">
                      {localStream ? (
                        <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white">You</div>
                      )}
                    </div>

                    {/* top-left name and timer */}
                    <div className="absolute left-4 top-4 bg-neutral-900/60 px-3 py-1 rounded-full text-white text-sm">
                      {currentChat?.name || currentChat?.username || 'Participant'} • {formatCallTime(callSeconds)}
                    </div>
                  </div>

                  {/* controls - bottom center */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex items-center gap-4">
                    <button onClick={addParticipant} className="flex items-center justify-center w-12 h-12 bg-neutral-800 text-white rounded-full shadow hover:bg-neutral-700" title="Add people">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v6M21 12h-6M3 7a4 4 0 014-4h0a4 4 0 014 4v1M3 17a4 4 0 004 4h0a4 4 0 004-4v-1" /></svg>
                    </button>

                    <button onClick={toggleMute} className={`flex items-center justify-center w-12 h-12 ${isMuted ? 'bg-red-600' : 'bg-neutral-800'} text-white rounded-full shadow-lg`} title="Mute/Unmute">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 00-1 1v3.586L4.707 3.293A1 1 0 103.293 4.707L6.586 8H5a1 1 0 00-1 1v2a1 1 0 001 1h2v1a5 5 0 005 5v-2a3 3 0 01-3-3V9h1.586l3.707 3.707A1 1 0 1013.293 13.293L9.707 9.707A1 1 0 009 9V3a1 1 0 00-1-1z" /></svg>
                    </button>

                    <button onClick={toggleCamera} className={`flex items-center justify-center w-12 h-12 ${cameraOff ? 'bg-red-600' : 'bg-neutral-800'} text-white rounded-full shadow-lg`} title="Toggle Camera">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V8l4 3V5a2 2 0 00-2-2H4z" /></svg>
                    </button>

                    <button onClick={endCall} className="flex items-center justify-center w-14 h-14 bg-red-600 text-white rounded-full shadow-2xl ring-4 ring-red-600/20" title="Hang up">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.657L10 18.828l-6.828-6.829a4 4 0 010-5.657z" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Media Viewer Modal */}
      {expandedMedia && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedMedia(null)}
        >
          <button
            onClick={() => setExpandedMedia(null)}
            className="absolute top-4 right-4 p-2 bg-neutral-800/80 hover:bg-neutral-700 rounded-full transition text-white z-10"
            title="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="max-w-6xl max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {expandedMedia.type === 'image' ? (
              <img
                src={expandedMedia.url}
                alt={expandedMedia.name}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
            ) : (
              <video
                src={expandedMedia.url}
                controls
                autoPlay
                className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
              />
            )}
          </div>

          {expandedMedia.name && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-neutral-900/90 px-6 py-3 rounded-full text-white text-sm">
              {expandedMedia.name}
            </div>
          )}
        </div>
      )}
    </>
  )
}
