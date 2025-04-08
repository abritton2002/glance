const express = require('express');
const supabase = require('../services/supabase');
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    
    // Register user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    });
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(201).json({
      user: data.user,
      session: data.session
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    res.json({
      user: data.user,
      session: data.session
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get user profile
router.get('/me', async (req, res) => {
  try {
    // Get auth header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No auth token' });
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Get user from session
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error) {
      return res.status(401).json({ message: error.message });
    }
    
    res.json(data.user);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: err.message });
  }
});

module.exports = router;