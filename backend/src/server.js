import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import { initSocket } from './socket.js'
import connectDB from './config/database.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import teamRoutes from './routes/teams.js'
import hackathonRoutes from './routes/hackathons.js'
import messageRoutes from './routes/messages.js'
import notificationRoutes from './routes/notifications.js'

dotenv.config()

// Connect to database
connectDB()

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 5000

// Initialize Socket.io
initSocket(server)

// Middleware
// Explicit CORS configuration so preflight (OPTIONS) responses are handled
// predictably in both dev (localhost) and deployed environments.
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL || 'https://dev-tribe.vercel.app/'
]
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 204
}

app.use(cors(corsOptions))
// Explicitly respond to preflight requests for all routes early
app.options('*', cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DevTribe API is running' })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/hackathons', hackathonRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/notifications', notificationRoutes)

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to DevTribe API' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

export default app

