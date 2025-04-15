const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/Inventory');
const upload = require('../middleware/upload');

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const items = await InventoryItem.find().sort({ timestamp: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory items', error });
  }
});

// Add a new inventory item
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, quantity, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const newItem = new InventoryItem({ name, quantity, description, imageUrl });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding inventory item', error });
  }
});

// Update an inventory item
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, quantity, description } = req.body;
    const updateData = { name, quantity, description };
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }
    const updatedItem = await InventoryItem.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating item', error });
  }
});

// Delete an inventory item
router.delete('/:id', async (req, res) => {
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error });
  }
});

module.exports = router; 