import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  hackathon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hackathon'
  },
  hackathonName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['leader', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  pendingRequests: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    requestedAt: {
      type: Date,
      default: Date.now
    }
  }],
  requiredMembers: {
    type: Number,
    required: true,
    default: 4
  },
  tech: [{
    type: String
  }],
  requiredSkills: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['open', 'full', 'closed'],
    default: 'open'
  },
  conversationId: {
    type: String
  }
}, {
  timestamps: true
})

// Auto-update status based on member count
teamSchema.pre('save', function(next) {
  if (this.members.length >= this.requiredMembers) {
    this.status = 'full'
  } else if (this.status === 'full' && this.members.length < this.requiredMembers) {
    this.status = 'open'
  }
  next()
})

export default mongoose.model('Team', teamSchema)
