const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const seedDefaultUser = require('./utils/seedUser');

// Import routes
const activityRoutes = require('./routes/activities');
const inventoryRoutes = require('./routes/inventory');
const costIncomeRoutes = require('./routes/costIncome');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  seedDefaultUser();
})
.catch(err => console.log(err));

// Use routes
app.use('/activities', activityRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/cost-income', costIncomeRoutes);
app.use('/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});