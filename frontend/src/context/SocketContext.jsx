import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext(null)

export const useSocket = () => {
    const context = useContext(SocketContext)
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider')
    }
    return context
}

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const { user } = useAuth()

    useEffect(() => {
        let newSocket

        if (user) {
            // Initialize socket connection
            // Extract origin from API URL (remove /api path)
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
            const socketUrl = new URL(apiUrl).origin

            newSocket = io(socketUrl, {
                transports: ['websocket'],
                reconnection: true,
            })

            newSocket.on('connect', () => {
                console.log('Socket connected')
                newSocket.emit('user_connected', user._id)
            })

            newSocket.on('online_users', (users) => {
                setOnlineUsers(users)
            })

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected')
            })

            setSocket(newSocket)
        }

        return () => {
            if (newSocket) {
                newSocket.disconnect()
            }
        }
    }, [user])

    const value = {
        socket,
        onlineUsers
    }

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}
