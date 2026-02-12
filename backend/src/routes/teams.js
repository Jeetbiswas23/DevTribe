import express from 'express'
import { auth } from '../middleware/auth.js'
import Team from '../models/Team.js'
import User from '../models/User.js'
import Notification from '../models/Notification.js'

const router = express.Router()

// Create team
router.post('/', auth, async (req, res) => {
  try {
    const { name, hackathon, hackathonName, description, requiredMembers, tech, requiredSkills } = req.body

    const team = new Team({
      name,
      hackathonName,
      description,
      requiredMembers: requiredMembers || 4,
      tech: tech || [],
      requiredSkills: requiredSkills || [],
      leader: req.userId,
      members: [{
        user: req.userId,
        role: 'leader'
      }],
      conversationId: `conv_${Date.now()}`
    })

    if (hackathon) {
      team.hackathon = hackathon
    }

    await team.save()

    // Add team to user's teams
    await User.findByIdAndUpdate(req.userId, {
      $push: { teams: team._id }
    })

    const populatedTeam = await Team.findById(team._id)
      .populate('leader', 'username name avatar')
      .populate('members.user', 'username name avatar')

    res.status(201).json({ team: populatedTeam, message: 'Team created successfully' })
  } catch (error) {
    console.error('Create team error:', error)
    res.status(500).json({ error: 'Failed to create team', details: error.message })
  }
})

// Get all teams
router.get('/', auth, async (req, res) => {
  try {
    const { hackathon, search } = req.query

    let query = {}
    if (hackathon) {
      query.hackathonName = hackathon
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tech: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    const teams = await Team.find(query)
      .populate('leader', 'username name avatar')
      .populate('members.user', 'username name avatar')
      .populate('pendingRequests.user', 'username name avatar')
      .sort({ createdAt: -1 })

    res.json({ teams })
  } catch (error) {
    console.error('Get teams error:', error)
    res.status(500).json({ error: 'Failed to fetch teams' })
  }
})

// Get team by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leader', 'username name avatar bio skills')
      .populate('members.user', 'username name avatar bio skills')
      .populate('pendingRequests.user', 'username name avatar bio skills')

    if (!team) {
      return res.status(404).json({ error: 'Team not found' })
    }

    res.json({ team })
  } catch (error) {
    console.error('Get team error:', error)
    res.status(500).json({ error: 'Failed to fetch team' })
  }
})

// Apply to team
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const { message } = req.body
    const team = await Team.findById(req.params.id)

    if (!team) {
      return res.status(404).json({ error: 'Team not found' })
    }

    // Check if already a member
    const isMember = team.members.some(m => m.user.toString() === req.userId)
    if (isMember) {
      return res.status(400).json({ error: 'Already a member of this team' })
    }

    // Check if already applied
    const alreadyApplied = team.pendingRequests.some(r => r.user.toString() === req.userId)
    if (alreadyApplied) {
      return res.status(400).json({ error: 'Already applied to this team' })
    }

    // Check if team is full
    if (team.members.length >= team.requiredMembers) {
      return res.status(400).json({ error: 'Team is already full' })
    }

    // Add request
    team.pendingRequests.push({
      user: req.userId,
      message: message || ''
    })

    await team.save()

    // Create notification for team leader
    const currentUser = await User.findById(req.userId)
    await Notification.create({
      recipient: team.leader,
      sender: req.userId,
      type: 'team_request',
      title: 'New Team Request',
      message: `${currentUser.name} wants to join your team "${team.name}"`,
      data: { teamId: team._id, userId: req.userId }
    })

    res.json({ message: 'Application sent successfully' })
  } catch (error) {
    console.error('Apply to team error:', error)
    res.status(500).json({ error: 'Failed to apply to team' })
  }
})

// Accept/reject team request
router.post('/:id/requests/:userId/:action', auth, async (req, res) => {
  try {
    const { id, userId, action } = req.params
    const team = await Team.findById(id)

    if (!team) {
      return res.status(404).json({ error: 'Team not found' })
    }

    // Check if current user is leader
    if (team.leader.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only team leader can accept/reject requests' })
    }

    // Find request
    const requestIndex = team.pendingRequests.findIndex(
      r => r.user.toString() === userId
    )

    if (requestIndex === -1) {
      return res.status(404).json({ error: 'Request not found' })
    }

    const request = team.pendingRequests[requestIndex]

    if (action === 'accept') {
      // Add to members
      team.members.push({
        user: userId,
        role: 'member'
      })

      // Add team to user's teams
      await User.findByIdAndUpdate(userId, {
        $push: { teams: team._id }
      })

      // Create notification
      await Notification.create({
        recipient: userId,
        sender: req.userId,
        type: 'team_accepted',
        title: 'Team Request Accepted',
        message: `Your request to join "${team.name}" has been accepted!`,
        data: { teamId: team._id }
      })
    } else if (action === 'reject') {
      // Create notification
      await Notification.create({
        recipient: userId,
        sender: req.userId,
        type: 'team_rejected',
        title: 'Team Request Rejected',
        message: `Your request to join "${team.name}" was not accepted`,
        data: { teamId: team._id }
      })
    }

    // Remove request
    team.pendingRequests.splice(requestIndex, 1)
    await team.save()

    res.json({ message: `Request ${action}ed successfully` })
  } catch (error) {
    console.error('Handle request error:', error)
    res.status(500).json({ error: 'Failed to handle request' })
  }
})

// Update team
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, hackathonName, requiredMembers, tech, requiredSkills } = req.body
    const team = await Team.findById(req.params.id)

    if (!team) {
      return res.status(404).json({ error: 'Team not found' })
    }

    // Check if current user is leader
    if (team.leader.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only team leader can update the team' })
    }

    // Update fields
    if (name) team.name = name
    if (description) team.description = description
    if (hackathonName) team.hackathonName = hackathonName
    if (requiredMembers) team.requiredMembers = requiredMembers
    if (tech) team.tech = tech
    if (requiredSkills) team.requiredSkills = requiredSkills

    await team.save()

    res.json({ team, message: 'Team updated successfully' })
  } catch (error) {
    console.error('Update team error:', error)
    res.status(500).json({ error: 'Failed to update team' })
  }
})

// Remove member from team
router.delete('/:id/members/:userId', auth, async (req, res) => {
  try {
    const { id, userId } = req.params
    const team = await Team.findById(id)

    if (!team) {
      return res.status(404).json({ error: 'Team not found' })
    }

    // Check if current user is leader
    if (team.leader.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only team leader can remove members' })
    }

    // Can't remove leader
    if (userId === team.leader.toString()) {
      return res.status(400).json({ error: 'Cannot remove team leader' })
    }

    // Remove member
    team.members = team.members.filter(m => m.user.toString() !== userId)
    await team.save()

    // Remove team from user's teams
    await User.findByIdAndUpdate(userId, {
      $pull: { teams: team._id }
    })

    res.json({ message: 'Member removed successfully' })
  } catch (error) {
    console.error('Remove member error:', error)
    res.status(500).json({ error: 'Failed to remove member' })
  }
})

// Delete team
router.delete('/:id', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)

    if (!team) {
      return res.status(404).json({ error: 'Team not found' })
    }

    // Check if current user is leader
    if (team.leader.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only team leader can delete the team' })
    }

    // Remove team from all members
    await User.updateMany(
      { _id: { $in: team.members.map(m => m.user) } },
      { $pull: { teams: team._id } }
    )

    await Team.findByIdAndDelete(req.params.id)

    res.json({ message: 'Team deleted successfully' })
  } catch (error) {
    console.error('Delete team error:', error)
    res.status(500).json({ error: 'Failed to delete team' })
  }
})

export default router
