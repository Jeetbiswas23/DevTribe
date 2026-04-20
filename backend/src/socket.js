import { Server } from 'socket.io'

let io

const allowedOrigins = [
    'http://localhost:5173',
    'https://dev-tribe.vercel.app'
]

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true)
                } else {
                    callback(new Error('Socket.IO: Not allowed by CORS'))
                }
            },
            methods: ['GET', 'POST'],
            credentials: true
        }
    })

    // Map to store online users: userId -> socketId
    const onlineUsers = new Map()

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`)

        // Handle user login/connection
        socket.on('user_connected', (userId) => {
            if (!userId) return

            onlineUsers.set(userId, socket.id)
            console.log(`User ${userId} is online`)

            // Broadcast online users list to all clients
            io.emit('online_users', Array.from(onlineUsers.keys()))
        })

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`)

            // Remove user from online users
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId)
                    console.log(`User ${userId} is offline`)
                    break
                }
            }

            // Broadcast updated online users list
            io.emit('online_users', Array.from(onlineUsers.keys()))
        })
    })

    return io
}

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!')
    }
    return io
}
