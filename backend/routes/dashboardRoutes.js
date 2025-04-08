const express = require('express');
const supabase = require('../services/supabase');
const auth = require('../middleware/auth');
const configTranslator = require('../services/configTranslator');
const containerService = require('../services/containerService');
const router = express.Router();

// Get default dashboard (create if doesn't exist)
router.get('/default', async (req, res) => {
  try {
    // First try to find an existing default dashboard
    let { data: dashboards, error } = await supabase
      .from('dashboards')
      .select('*')
      .eq('is_default', true)
      .limit(1);

    if (error) throw error;

    // If no default dashboard exists, create one
    if (!dashboards || dashboards.length === 0) {
      const { data: newDashboard, error: createError } = await supabase
        .from('dashboards')
        .insert([
          {
            name: 'Default Dashboard',
            is_default: true,
            layout: {
              pages: [
                {
                  name: 'Home',
                  columns: []
                }
              ]
            }
          }
        ])
        .select();

      if (createError) throw createError;
      res.json(newDashboard[0]);
    } else {
      res.json(dashboards[0]);
    }
  } catch (error) {
    console.error('Error getting default dashboard:', error);
    res.status(500).json({ error: 'Failed to get default dashboard' });
  }
});

// Get all dashboards for a user
router.get('/', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('dashboards')
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

// Get a specific dashboard
router.get('/:id', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('dashboards')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();
    
    if (error) {
      return res.status(404).json({ message: 'Dashboard not found' });
    }
    
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new dashboard
router.post('/', auth, async (req, res) => {
  try {
    const { name, layout } = req.body;
    
    // Check if this is the first dashboard (make it default)
    const { data: existingDashboards, error: countError } = await supabase
      .from('dashboards')
      .select('id')
      .eq('user_id', req.user.id);
    
    if (countError) {
      return res.status(500).json({ message: countError.message });
    }
    
    const isDefault = existingDashboards.length === 0;
    
    // Create new dashboard
    const { data, error } = await supabase
      .from('dashboards')
      .insert([
        {
          user_id: req.user.id,
          name,
          is_default: isDefault,
          layout
        }
      ])
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    // Generate YAML file for the dashboard
    const configPath = await configTranslator.generateYamlFile(data, req.user.id);
    
    // Deploy container for the dashboard
    await containerService.deployDashboard(req.user.id, data.id, configPath);
    
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Update a dashboard
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, layout } = req.body;
    
    // Update dashboard
    const { data, error } = await supabase
      .from('dashboards')
      .update({
        name: name,
        layout: layout,
        updated_at: new Date()
      })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    // Generate updated YAML file
    const configPath = await configTranslator.generateYamlFile(data, req.user.id);
    
    // Update dashboard container
    await containerService.deployDashboard(req.user.id, data.id, configPath);
    
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Delete a dashboard
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if this is the default dashboard
    const { data: dashboard, error: fetchError } = await supabase
      .from('dashboards')
      .select('is_default')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();
    
    if (fetchError) {
      return res.status(404).json({ message: 'Dashboard not found' });
    }
    
    if (dashboard.is_default) {
      return res.status(400).json({ message: "Can't delete default dashboard" });
    }
    
    // Delete dashboard
    const { error } = await supabase
      .from('dashboards')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    // Remove dashboard container
    await containerService.removeContainer(req.user.id, req.params.id);
    
    res.json({ message: 'Dashboard deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;