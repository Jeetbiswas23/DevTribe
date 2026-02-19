import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name, userType } = req.body

    // Validation
    if (!username || !email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already registered' })
      }
      return res.status(400).json({ error: 'Username already taken' })
    }

    // Create user
    const user = new User({
      username: username.toLowerCase().replace('@', ''),
      email: email.toLowerCase(),
      password,
      name,
      userType: userType || 'user',
      ...req.body // Spread other fields like bio, skills, professional info
    })

    await user.save()

    // Generate token and set HttpOnly cookie for browser clients
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Cookie options: secure in production, SameSite none to allow cross-site cookies from your Vercel frontend
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }

    res.cookie('token', token, cookieOptions)

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        userType: user.userType
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ error: 'Failed to create user', details: error.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/username and password are required' })
    }

    // Find user by email or username
    // If identifier starts with '@' it's a username; otherwise treat it as email or username but don't strip '@' from emails
    const lower = identifier.toLowerCase()
    const cleanIdentifier = lower.startsWith('@') ? lower.replace(/^@/, '') : lower
    const user = await User.findOne({
      $or: [
        { email: cleanIdentifier },
        { username: cleanIdentifier }
      ]
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Update last active
    user.lastActive = new Date()
    await user.save()

    // Generate token and set HttpOnly cookie
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    }

    res.cookie('token', token, cookieOptions)

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        skills: user.skills,
        userType: user.userType,
        github: user.github,
        linkedin: user.linkedin,
        twitter: user.twitter,
        website: user.website
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed', details: error.message })
  }
})

// Get current user
router.get('/me', async (req, res) => {
  try {
    // Accept token via Authorization header or HttpOnly cookie
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.token

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
      .populate('following', 'username name avatar')
      .populate('followers', 'username name avatar')

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ user })
  } catch (error) {
    console.error('Get me error:', error)
    res.status(500).json({ error: 'Failed to get user' })
  }
})

export default router

// Logout route to clear the HttpOnly cookie
router.post('/logout', (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none'
    })
    return res.json({ message: 'Logged out' })
  } catch (error) {
    console.error('Logout error:', error)
    return res.status(500).json({ error: 'Logout failed' })
  }
})
