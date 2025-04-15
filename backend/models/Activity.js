const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  activity: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', activitySchema); 