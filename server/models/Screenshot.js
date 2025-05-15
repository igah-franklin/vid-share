const mongoose = require('mongoose');

const ScreenshotSchema = new mongoose.Schema({
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
  imageUrl: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['ready', 'error', 'archived'],
    default: 'ready'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Screenshot', ScreenshotSchema);