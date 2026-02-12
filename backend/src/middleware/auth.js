import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided, authorization denied' })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password')
    
    if (!user) {
      return res.status(401).json({ error: 'User not found, authorization denied' })
    }

    // Attach user to request
    req.user = user
    req.userId = decoded.userId
    
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    }
    
    res.status(500).json({ error: 'Server error in authentication' })
  }
}

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.userId).select('-password')
      
      if (user) {
        req.user = user
        req.userId = decoded.userId
      }
    }
    
    next()
  } catch (error) {
    // Continue without auth
    next()
  }
}

// Role-based middleware
export const isJudge = (req, res, next) => {
  if (req.user && req.user.userType === 'judge') {
    next()
  } else {
    res.status(403).json({ error: 'Access denied. Judge role required.' })
  }
}

export const isHR = (req, res, next) => {
  if (req.user && req.user.userType === 'hr') {
    next()
  } else {
    res.status(403).json({ error: 'Access denied. HR role required.' })
  }
}
