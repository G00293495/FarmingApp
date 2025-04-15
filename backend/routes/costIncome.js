const express = require('express');
const router = express.Router();
const CostIncome = require('../models/CostIncome');

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await CostIncome.find().sort({ timestamp: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
});

// Add a new transaction
router.post('/', async (req, res) => {
  try {
    const { type, amount, description } = req.body;
    if (!type || !amount) {
      return res.status(400).json({ message: 'Type and amount are required.' });
    }
    
    const newTransaction = new CostIncome({ type, amount, description });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Error adding transaction', error });
  }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
  try {
    await CostIncome.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error });
  }
});

module.exports = router; 