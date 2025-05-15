const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Screenshot = require('../../models/Screenshot');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = './uploads/screenshots';
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('File upload only supports image formats'));
  }
});

// @route   GET api/screenshots
// @desc    Get all screenshots for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const screenshots = await Screenshot.find({ 
      user: req.user.id,
      status: 'ready'
    }).sort({ createdAt: -1 });
    res.json(screenshots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/screenshots/archived
// @desc    Get all archived screenshots for a user
// @access  Private
router.get('/archived', auth, async (req, res) => {
  try {
    const screenshots = await Screenshot.find({ 
      user: req.user.id,
      status: 'archived'
    }).sort({ createdAt: -1 });
    res.json(screenshots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/screenshots/:id
// @desc    Get screenshot by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const screenshot = await Screenshot.findById(req.params.id);
    
    if (!screenshot) {
      return res.status(404).json({ msg: 'Screenshot not found' });
    }

    // Check if the screenshot belongs to the user
    if (screenshot.user.toString() !== req.user.id && !screenshot.isPublic) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(screenshot);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Screenshot not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/screenshots
// @desc    Upload a screenshot
// @access  Private
router.post('/', auth, upload.single('screenshot'), async (req, res) => {
  try {
    const { title, description, isPublic } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ msg: 'No screenshot file uploaded' });
    }

    const newScreenshot = new Screenshot({
      user: req.user.id,
      title: title || 'Untitled Screenshot',
      description: description || '',
      filename: req.file.filename,
      imageUrl: `/uploads/screenshots/${req.file.filename}`,
      isPublic: isPublic === 'true'
    });

    const screenshot = await newScreenshot.save();
    res.json(screenshot);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/screenshots/:id
// @desc    Update screenshot details
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, isPublic } = req.body;

  try {
    let screenshot = await Screenshot.findById(req.params.id);
    
    if (!screenshot) {
      return res.status(404).json({ msg: 'Screenshot not found' });
    }

    // Check if the screenshot belongs to the user
    if (screenshot.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update fields
    if (title) screenshot.title = title;
    if (description !== undefined) screenshot.description = description;
    if (isPublic !== undefined) screenshot.isPublic = isPublic === 'true';

    await screenshot.save();
    res.json(screenshot);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Screenshot not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/screenshots/:id/archive
// @desc    Archive a screenshot
// @access  Private
router.put('/:id/archive', auth, async (req, res) => {
  try {
    let screenshot = await Screenshot.findById(req.params.id);
    
    if (!screenshot) {
      return res.status(404).json({ msg: 'Screenshot not found' });
    }

    // Check if the screenshot belongs to the user
    if (screenshot.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    screenshot.status = 'archived';
    await screenshot.save();
    
    res.json(screenshot);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Screenshot not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/screenshots/:id
// @desc    Delete a screenshot
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const screenshot = await Screenshot.findById(req.params.id);
    
    if (!screenshot) {
      return res.status(404).json({ msg: 'Screenshot not found' });
    }

    // Check if the screenshot belongs to the user
    if (screenshot.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Delete the actual file
    const filePath = path.join(__dirname, '../../../uploads/screenshots', screenshot.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await screenshot.remove();
    res.json({ msg: 'Screenshot removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Screenshot not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;