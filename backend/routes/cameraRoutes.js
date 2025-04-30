const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const imageSchema = new mongoose.Schema({
  filename: String,
  timestamp: { type: Date, default: Date.now },
});

const CameraImage = mongoose.model('CameraImage', imageSchema);

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const newImage = new CameraImage({
      filename: req.file.filename,
    });
    await newImage.save();

    res.status(201).json({
      message: 'Image uploaded successfully',
      image: `/uploads/${req.file.filename}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

router.get('/images', async (req, res) => {
  try {
    const images = await CameraImage.find().sort({ timestamp: -1 });

    const formatted = images.map(img => ({
      url: `/uploads/${img.filename}`,
      timestamp: img.timestamp
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch images' });
  }
});

module.exports = router;
