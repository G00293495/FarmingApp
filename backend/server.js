const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config(); 

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'farming_app_secure_jwt_secret';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import auth middleware
const auth = require('./middleware/auth');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("MongoDB connected");
    seedDefaultUser();
  })
  .catch(err => console.log(err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  name: String,
  role: { 
    type: String, 
    default: 'user' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const User = mongoose.model("User", userSchema);

// Activity Schema and Model
const activitySchema = new mongoose.Schema({
  activity: String,
  timestamp: { type: Date, default: Date.now },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Activity = mongoose.model("Activity", activitySchema);

// Inventory Schema and Model
const inventorySchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  description: String,
  imageUrl: String,
  timestamp: { type: Date, default: Date.now },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const InventoryItem = mongoose.model("InventoryItem", inventorySchema);

// Cost and Income Schema and Model
const costIncomeSchema = new mongoose.Schema({
  type: { type: String, enum: ["cost", "income"], required: true },
  amount: { type: Number, required: true },
  description: String,
  timestamp: { type: Date, default: Date.now },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const CostIncome = mongoose.model("CostIncome", costIncomeSchema);

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');

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

// Authentication Routes
// Register route
app.post("/auth/register", async (req, res) => {
  try {
    const { username, password, name } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const newUser = new User({
      username,
      password: hashedPassword,
      name: name || username
    });
    
    await newUser.save();
    
    // Create JWT token
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({ 
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        name: newUser.name
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login route
app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Auth check route
app.get("/auth/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    
    res.json({ 
      user: {
        id: user._id,
        username: user.username,
        name: user.name
      }
    });
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Activity Routes
app.post("/activities", auth, async (req, res) => {
  try {
    const { activity } = req.body;
    const newActivity = new Activity({ 
      activity, 
      userId: req.user.userId 
    });
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    console.error("Error adding activity:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/activities", auth, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user.userId })
      .sort({ timestamp: -1 });
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Inventory Routes
app.post("/inventory", auth, upload.single('image'), async (req, res) => {
  try {
    const { name, quantity, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const newItem = new InventoryItem({ 
      name, 
      quantity, 
      description, 
      imageUrl,
      userId: req.user.userId
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error adding inventory item:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/inventory/:id", auth, upload.single('image'), async (req, res) => {
  try {
    const { name, quantity, description } = req.body;
    const updateData = { name, quantity, description };
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    // Check if item belongs to user
    const item = await InventoryItem.findById(req.params.id);
    if (!item || item.userId.toString() !== req.user.userId) {
      return res.status(404).json({ message: "Item not found or access denied" });
    }
    
    const updatedItem = await InventoryItem.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Error updating item", error });
  }
});

app.get("/inventory", auth, async (req, res) => {
  try {
    const items = await InventoryItem.find({ userId: req.user.userId })
      .sort({ timestamp: -1 });
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/inventory/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if item belongs to user
    const item = await InventoryItem.findById(id);
    if (!item || item.userId.toString() !== req.user.userId) {
      return res.status(404).json({ message: "Item not found or access denied" });
    }
    
    await InventoryItem.findByIdAndDelete(id);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Error deleting item", error });
  }
});

// Cost and Income Routes
app.post("/cost-income", auth, async (req, res) => {
  try {
    const { type, amount, description } = req.body;
    if (!type || !amount) {
      return res.status(400).json({ message: "Type and amount are required." });
    }

    const newTransaction = new CostIncome({ 
      type, 
      amount, 
      description,
      userId: req.user.userId
    });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ message: "Error adding transaction", error });
  }
});

app.get("/cost-income", auth, async (req, res) => {
  try {
    const transactions = await CostIncome.find({ userId: req.user.userId })
      .sort({ timestamp: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transactions", error });
  }
});

app.delete("/cost-income/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if transaction belongs to user
    const transaction = await CostIncome.findById(id);
    if (!transaction || transaction.userId.toString() !== req.user.userId) {
      return res.status(404).json({ message: "Transaction not found or access denied" });
    }
    
    await CostIncome.findByIdAndDelete(id);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Error deleting transaction", error });
  }
});

// Create default user if none exists
const seedDefaultUser = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password', salt);
      
      const defaultUser = new User({
        username: 'user',
        password: hashedPassword,
        name: 'Default User'
      });
      
      await defaultUser.save();
      console.log('Default user created');
    }
  } catch (error) {
    console.error('Error creating default user:', error);
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});