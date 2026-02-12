import express from 'express'
import { auth } from '../middleware/auth.js'
import Message from '../models/Message.js'
import User from '../models/User.js'

const router = express.Router()

// Get conversations (recent chats)
router.get('/conversations', auth, async (req, res) => {
    try {
        // Find all messages where current user is sender or recipient
        const messages = await Message.find({
            $or: [{ sender: req.userId }, { recipient: req.userId }]
        })
            .sort({ createdAt: -1 })
            .populate('sender', 'name username avatar')
            .populate('recipient', 'name username avatar')

        const conversations = []
        const processedUsers = new Set()

        for (const msg of messages) {
            const otherUser = msg.sender._id.toString() === req.userId ? msg.recipient : msg.sender

            if (!processedUsers.has(otherUser._id.toString())) {
                processedUsers.add(otherUser._id.toString())
                conversations.push({
                    user: otherUser,
                    lastMessage: {
                        content: msg.content,
                        createdAt: msg.createdAt,
                        read: msg.read,
                        isOwn: msg.sender._id.toString() === req.userId
                    }
                })
            }
        }

        res.json({ conversations })
    } catch (error) {
        console.error('Get conversations error:', error)
        res.status(500).json({ error: 'Failed to fetch conversations' })
    }
})

// Get chat history with a user
router.get('/:userId', auth, async (req, res) => {
    try {
        const { userId } = req.params

        // Check if user exists (can be by ID or username if needed, but ID is safer for router params)
        // Note: frontend might pass username or ID. Let's assume ID for now as it's cleaner.
        // If we need username support, we'd check if specific user exists first.

        let targetUserId = userId
        // Handle username if passed (starts with @ or just string)
        // But standardized to ID typically. To be safe, let's verify if 'userId' is a valid ObjectId.
        // If not, try to find by username.

        // Simple check: Mongo IDs are 24 chars hex. 
        // If we passed a username, we first need to resolve it.

        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            const user = await User.findOne({ username: userId.toLowerCase() })
            if (!user) return res.status(404).json({ error: 'User not found' })
            targetUserId = user._id
        }

        const messages = await Message.find({
            $or: [
                { sender: req.userId, recipient: targetUserId },
                { sender: targetUserId, recipient: req.userId }
            ]
        })
            .sort({ createdAt: 1 })
            .populate('sender', 'name username avatar')

        // Mark received messages as read
        await Message.updateMany(
            { sender: targetUserId, recipient: req.userId, read: false },
            { read: true }
        )

        res.json({ messages })
    } catch (error) {
        console.error('Get chat history error:', error)
        res.status(500).json({ error: 'Failed to fetch chat history' })
    }
})

// Send a message
router.post('/:userId', auth, async (req, res) => {
    try {
        const { userId } = req.params
        const { content } = req.body

        if (!content.trim()) {
            return res.status(400).json({ error: 'Message content required' })
        }

        let targetUserId = userId
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            const user = await User.findOne({ username: userId.toLowerCase() })
            if (!user) return res.status(404).json({ error: 'User not found' })
            targetUserId = user._id
        }

        const message = new Message({
            sender: req.userId,
            recipient: targetUserId,
            content
        })

        await message.save()

        // Populate sender for immediate frontend display
        await message.populate('sender', 'name username avatar')

        res.json({ message })
    } catch (error) {
        console.error('Send message error:', error)
        res.status(500).json({ error: 'Failed to send message' })
    }
})

export default router
