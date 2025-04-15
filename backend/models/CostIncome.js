const mongoose = require('mongoose');

const costIncomeSchema = new mongoose.Schema({
  type: { type: String, enum: ["cost", "income"], required: true },
  amount: { type: Number, required: true },
  description: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CostIncome', costIncomeSchema); 