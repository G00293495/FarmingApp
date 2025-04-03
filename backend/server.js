const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
require("dotenv").config(); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


const activitySchema = new mongoose.Schema({
  activity: String,
  timestamp: { type: Date, default: Date.now }
});

// Create a model from the schema
const Activity = mongoose.model("Activity", activitySchema);

app.post("/activities", async (req, res) => {
  const { activity } = req.body;
  const newActivity = new Activity({ activity });
  await newActivity.save();
  res.status(201).json(newActivity);
});

app.get("/activities", async (req, res) => {
  const activities = await Activity.find().sort({ timestamp: -1 });
  res.status(200).json(activities);
});


const inventorySchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  description: String,
  imageUrl: String,
  timestamp: { type: Date, default: Date.now }
});

// model from the schema
const InventoryItem = mongoose.model("InventoryItem", inventorySchema);

// multer for file uploads
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');

    // Check if uploads directory exists, if not create it
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Endpoint to add a new inventory item
app.post("/inventory", upload.single('image'), async (req, res) => {
  const { name, quantity, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const newItem = new InventoryItem({ name, quantity, description, imageUrl });
  await newItem.save();
  res.status(201).json(newItem);
});

// Endpoint to update an inventory item
app.put("/inventory/:id", upload.single('image'), async (req, res) => {
  const { name, quantity, description } = req.body;
  const updateData = { name, quantity, description };
  if (req.file) {
    updateData.imageUrl = `/uploads/${req.file.filename}`;
  }
  try {
    const updatedItem = await InventoryItem.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error });
  }
});

// Endpoint to get all inventory items
app.get("/inventory", async (req, res) => {
  const items = await InventoryItem.find().sort({ timestamp: -1 });
  res.status(200).json(items);
});

// Endpoint to delete an inventory item
app.delete("/inventory/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await InventoryItem.findByIdAndDelete(id);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
});


// schema for cost and income transactions
const costIncomeSchema = new mongoose.Schema({
  type: { type: String, enum: ["cost", "income"], required: true }, // "cost" or "income"
  amount: { type: Number, required: true },
  description: String,
  timestamp: { type: Date, default: Date.now }
});

const CostIncome = mongoose.model("CostIncome", costIncomeSchema);

// Add a new cost or income transaction
app.post("/cost-income", async (req, res) => {
  try {
    const { type, amount, description } = req.body;
    if (!type || !amount) return res.status(400).json({ message: "Type and amount are required." });

    const newTransaction = new CostIncome({ type, amount, description });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: "Error adding transaction", error });
  }
});

// Get all cost and income transactions
app.get("/cost-income", async (req, res) => {
  try {
    const transactions = await CostIncome.find().sort({ timestamp: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
});

// Delete a transaction
app.delete("/cost-income/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await CostIncome.findByIdAndDelete(id);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction", error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});