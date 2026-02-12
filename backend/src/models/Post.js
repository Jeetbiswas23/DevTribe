import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String
  }],
  links: [{
    type: String
  }],
  hackathon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hackathon'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  shares: {
    type: Number,
    default: 0
  },
  visibility: {
    type: String,
    enum: ['public', 'followers', 'private'],
    default: 'public'
  }
}, {
  timestamps: true
})

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length
})

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length
})

export default mongoose.model('Post', postSchema)
