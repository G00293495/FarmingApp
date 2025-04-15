const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// Get all activities
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find().sort({ timestamp: -1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities', error });
  }
});

// Create a new activity
router.post('/', async (req, res) => {
  try {
    const { activity } = req.body;
    const newActivity = new Activity({ activity });
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ message: 'Error creating activity', error });
  }
});

module.exports = router; 