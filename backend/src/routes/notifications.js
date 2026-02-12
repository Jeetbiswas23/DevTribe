import express from 'express'
import { auth } from '../middleware/auth.js'
import Notification from '../models/Notification.js'

const router = express.Router()

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const { limit = 50, unreadOnly } = req.query

    let query = { recipient: req.userId }
    if (unreadOnly === 'true') {
      query.read = false
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'username name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))

    const unreadCount = await Notification.countDocuments({
      recipient: req.userId,
      read: false
    })

    res.json({ notifications, unreadCount })
  } catch (error) {
    console.error('Get notifications error:', error)
    res.status(500).json({ error: 'Failed to fetch notifications' })
  }
})

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' })
    }

    if (notification.recipient.toString() !== req.userId) {
      return res.status(403).json({ error: 'Access denied' })
    }

    notification.read = true
    await notification.save()

    res.json({ message: 'Notification marked as read' })
  } catch (error) {
    console.error('Mark as read error:', error)
    res.status(500).json({ error: 'Failed to mark as read' })
  }
})

// Mark all as read
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.userId, read: false },
      { read: true }
    )

    res.json({ message: 'All notifications marked as read' })
  } catch (error) {
    console.error('Mark all as read error:', error)
    res.status(500).json({ error: 'Failed to mark all as read' })
  }
})

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' })
    }

    if (notification.recipient.toString() !== req.userId) {
      return res.status(403).json({ error: 'Access denied' })
    }

    await Notification.findByIdAndDelete(req.params.id)

    res.json({ message: 'Notification deleted' })
  } catch (error) {
    console.error('Delete notification error:', error)
    res.status(500).json({ error: 'Failed to delete notification' })
  }
})

export default router
