const express = require('express');
const supabase = require('../services/supabase');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all todos for a user
router.get('/', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new todo
router.post('/', auth, async (req, res) => {
  try {
    const { text, completed } = req.body;
    
    const { data, error } = await supabase
      .from('todos')
      .insert([
        {
          user_id: req.user.id,
          text,
          completed: completed || false
        }
      ])
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Update a todo
router.put('/:id', auth, async (req, res) => {
  try {
    const { text, completed } = req.body;
    
    const { data, error } = await supabase
      .from('todos')
      .update({
        text,
        completed,
        updated_at: new Date()
      })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Delete a todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 