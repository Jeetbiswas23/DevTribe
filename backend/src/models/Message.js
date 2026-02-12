import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

// Index for faster queries
messageSchema.index({ sender: 1, recipient: 1 })
messageSchema.index({ recipient: 1, sender: 1 })
messageSchema.index({ createdAt: -1 })

export default mongoose.model('Message', messageSchema)
