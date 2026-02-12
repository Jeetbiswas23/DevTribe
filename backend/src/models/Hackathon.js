import mongoose from 'mongoose'

const hackathonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  tagline: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'
  },
  category: {
    type: String,
    required: true,
    enum: ['Web Development', 'Mobile Apps', 'AI/ML', 'Blockchain', 'IoT', 'Gaming', 'AR/VR', 'Security', 'Other']
  },
  mode: {
    type: String,
    required: true,
    enum: ['Online', 'Offline', 'Hybrid']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  maxParticipants: {
    type: Number,
    default: 500
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  prizePool: {
    type: String,
    required: true
  },
  prizes: [{
    position: String,
    amount: String,
    description: String
  }],
  sponsors: [{
    name: String,
    logo: String,
    website: String
  }],
  judges: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    invitedAt: {
      type: Date,
      default: Date.now
    }
  }],
  rounds: [{
    name: String,
    type: {
      type: String,
      enum: ['mcq', 'coding', 'presentation', 'other']
    },
    description: String,
    duration: Number,
    startTime: Date,
    endTime: Date
  }],
  rules: [{
    type: String
  }],
  tracks: [{
    name: String,
    description: String,
    prizes: String
  }],
  techStack: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Upcoming', 'Open', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  website: String,
  discord: String,
  slack: String,
  devpost: String
}, {
  timestamps: true
})

// Virtual for participant count
hackathonSchema.virtual('participantCount').get(function() {
  return this.participants.length
})

// Virtual for team count
hackathonSchema.virtual('teamCount').get(function() {
  return this.teams.length
})

export default mongoose.model('Hackathon', hackathonSchema)
