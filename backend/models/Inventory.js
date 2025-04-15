const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  description: String,
  imageUrl: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InventoryItem', inventorySchema); 