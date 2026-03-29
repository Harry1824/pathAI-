import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const newUser = new User({
      username,
      password,
      name: username
    });
    
    await newUser.save();

    return res.status(201).json({
      success: true,
      token: `fake-jwt-token-${newUser._id}`,
      user: newUser
    });
  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    
    if (user) {
      return res.status(200).json({
        success: true,
        token: `fake-jwt-token-${user._id}`,
        user
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
