const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../../models/Video');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = './uploads/videos';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /mp4|webm|ogg/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('File upload only supports video formats'));
  }
});

// @route   GET api/videos
// @desc    Get all videos for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const videos = await Video.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/videos/archived
// @desc    Get all archived videos for a user
// @access  Private
router.get('/archived', auth, async (req, res) => {
  try {
    const videos = await Video.find({ 
      user: req.user.id,
      status: 'archived'
    }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/videos/:id
// @desc    Get video by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ msg: 'Video not found' });
    }

    // Check if the video belongs to the user
    if (video.user.toString() !== req.user.id && !video.isPublic) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    if (!video.isPublic) {
      // Increment views only for private videos viewed by owner
      video.views += 1;
      await video.save();
    }

    res.json(video);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Video not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/videos
// @desc    Upload a video
// @access  Private
router.post('/', auth, upload.single('video'), async (req, res) => {
  try {
    const { title, description, duration, isPublic } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ msg: 'No video file uploaded' });
    }

    const newVideo = new Video({
      user: req.user.id,
      title: title || 'Untitled Video',
      description: description || '',
      filename: req.file.filename,
      duration: duration || 0,
      thumbnailUrl: '/uploads/thumbnails/default.jpg', // Default thumbnail
      isPublic: isPublic === 'true'
    });

    const video = await newVideo.save();
    res.json(video);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/videos/:id
// @desc    Update video details
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, isPublic } = req.body;

  try {
    let video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ msg: 'Video not found' });
    }

    // Check if the video belongs to the user
    if (video.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update fields
    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (isPublic !== undefined) video.isPublic = isPublic === 'true';

    await video.save();
    res.json(video);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Video not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/videos/:id/archive
// @desc    Archive a video
// @access  Private
router.put('/:id/archive', auth, async (req, res) => {
  try {
    let video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ msg: 'Video not found' });
    }

    // Check if the video belongs to the user
    if (video.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    video.status = 'archived';
    await video.save();
    
    res.json(video);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Video not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/videos/:id
// @desc    Delete a video
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ msg: 'Video not found' });
    }

    // Check if the video belongs to the user
    if (video.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Delete the actual file
    const filePath = path.join(__dirname, '../../../uploads/videos', video.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await video.remove();
    res.json({ msg: 'Video removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Video not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;