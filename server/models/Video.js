const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  filename: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 0
  },
  thumbnailUrl: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['processing', 'ready', 'error', 'archived'],
    default: 'processing'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Video', VideoSchema);