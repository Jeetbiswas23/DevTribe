import express from 'express'
import { auth } from '../middleware/auth.js'
import Hackathon from '../models/Hackathon.js'
import User from '../models/User.js'
import Notification from '../models/Notification.js'

const router = express.Router()

// Create hackathon
router.post('/', auth, async (req, res) => {
  try {
    const hackathonData = {
      ...req.body,
      createdBy: req.userId
    }

    const hackathon = new Hackathon(hackathonData)
    await hackathon.save()

    // Add to user's hackathons
    await User.findByIdAndUpdate(req.userId, {
      $push: { hackathons: hackathon._id }
    })

    const populatedHackathon = await Hackathon.findById(hackathon._id)
      .populate('createdBy', 'username name avatar')

    res.status(201).json({ hackathon: populatedHackathon, message: 'Hackathon created successfully' })
  } catch (error) {
    console.error('Create hackathon error:', error)
    res.status(500).json({ error: 'Failed to create hackathon', details: error.message })
  }
})

// Get all hackathons
router.get('/', async (req, res) => {
  try {
    const { status, category, search, limit = 50 } = req.query
    
    let query = {}
    if (status) query.status = status
    if (category) query.category = category
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { techStack: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    const hackathons = await Hackathon.find(query)
      .populate('createdBy', 'username name avatar')
      .populate('participants', 'username name avatar')
      .populate('judges.user', 'username name avatar')
      .limit(parseInt(limit))
      .sort({ startDate: -1 })

    res.json({ hackathons })
  } catch (error) {
    console.error('Get hackathons error:', error)
    res.status(500).json({ error: 'Failed to fetch hackathons' })
  }
})

// Get hackathon by ID
router.get('/:id', async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id)
      .populate('createdBy', 'username name avatar bio')
      .populate('participants', 'username name avatar')
      .populate('teams')
      .populate('judges.user', 'username name avatar')

    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' })
    }

    res.json({ hackathon })
  } catch (error) {
    console.error('Get hackathon error:', error)
    res.status(500).json({ error: 'Failed to fetch hackathon' })
  }
})

// Update hackathon
router.put('/:id', auth, async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id)

    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' })
    }

    // Check if user is creator
    if (hackathon.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only creator can update the hackathon' })
    }

    const updatedHackathon = await Hackathon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username name avatar')

    res.json({ hackathon: updatedHackathon, message: 'Hackathon updated successfully' })
  } catch (error) {
    console.error('Update hackathon error:', error)
    res.status(500).json({ error: 'Failed to update hackathon' })
  }
})

// Delete hackathon
router.delete('/:id', auth, async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id)

    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' })
    }

    // Check if user is creator
    if (hackathon.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only creator can delete the hackathon' })
    }

    await Hackathon.findByIdAndDelete(req.params.id)

    // Remove from users
    await User.updateMany(
      { hackathons: hackathon._id },
      { $pull: { hackathons: hackathon._id } }
    )

    res.json({ message: 'Hackathon deleted successfully' })
  } catch (error) {
    console.error('Delete hackathon error:', error)
    res.status(500).json({ error: 'Failed to delete hackathon' })
  }
})

// Register for hackathon
router.post('/:id/register', auth, async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id)

    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' })
    }

    // Check if already registered
    if (hackathon.participants.includes(req.userId)) {
      return res.status(400).json({ error: 'Already registered for this hackathon' })
    }

    // Check if registration is still open
    if (new Date() > hackathon.registrationDeadline) {
      return res.status(400).json({ error: 'Registration deadline has passed' })
    }

    // Check max participants
    if (hackathon.maxParticipants && hackathon.participants.length >= hackathon.maxParticipants) {
      return res.status(400).json({ error: 'Hackathon is full' })
    }

    hackathon.participants.push(req.userId)
    await hackathon.save()

    // Add to user's hackathons
    await User.findByIdAndUpdate(req.userId, {
      $push: { hackathons: hackathon._id }
    })

    res.json({ message: 'Registered successfully' })
  } catch (error) {
    console.error('Register for hackathon error:', error)
    res.status(500).json({ error: 'Failed to register' })
  }
})

// Invite judge
router.post('/:id/invite-judge', auth, async (req, res) => {
  try {
    const { userId } = req.body
    const hackathon = await Hackathon.findById(req.params.id)

    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' })
    }

    // Check if user is creator
    if (hackathon.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only creator can invite judges' })
    }

    // Check if already invited
    const alreadyInvited = hackathon.judges.some(j => j.user.toString() === userId)
    if (alreadyInvited) {
      return res.status(400).json({ error: 'Judge already invited' })
    }

    hackathon.judges.push({ user: userId })
    await hackathon.save()

    // Create notification
    await Notification.create({
      recipient: userId,
      sender: req.userId,
      type: 'judge_invite',
      title: 'Judge Invitation',
      message: `You've been invited to judge "${hackathon.name}"`,
      data: { hackathonId: hackathon._id }
    })

    res.json({ message: 'Judge invited successfully' })
  } catch (error) {
    console.error('Invite judge error:', error)
    res.status(500).json({ error: 'Failed to invite judge' })
  }
})

// Respond to judge invitation
router.post('/:id/judge-response', auth, async (req, res) => {
  try {
    const { status } = req.body // 'accepted' or 'rejected'
    const hackathon = await Hackathon.findById(req.params.id)

    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' })
    }

    // Find judge invitation
    const judgeIndex = hackathon.judges.findIndex(j => j.user.toString() === req.userId)
    if (judgeIndex === -1) {
      return res.status(404).json({ error: 'Invitation not found' })
    }

    hackathon.judges[judgeIndex].status = status
    await hackathon.save()

    res.json({ message: `Invitation ${status}` })
  } catch (error) {
    console.error('Judge response error:', error)
    res.status(500).json({ error: 'Failed to respond to invitation' })
  }
})

export default router
