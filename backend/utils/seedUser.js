const bcrypt = require('bcrypt');
const User = require('../models/User');

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

module.exports = seedDefaultUser; 