import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isGroup: {
    type: Boolean,
    default: false
  },
  name: {
    type: String
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  channels: [{
    id: String,
    name: String,
    icon: String
  }],
  activeChannel: {
    type: String,
    default: 'general'
  },
  messages: {
    type: Map,
    of: [{
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      text: String,
      timestamp: {
        type: Date,
        default: Date.now
      },
      reactions: {
        type: Map,
        of: Number
      },
      files: [{
        name: String,
        type: String,
        size: Number,
        data: String,
        url: String,
        isVoice: Boolean
      }],
      edited: Boolean
    }]
  },
  lastMessage: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

export default mongoose.model('Conversation', conversationSchema)
