const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');
const auth = require('../middleware/auth');

// Get all widgets for a dashboard
router.get('/:dashboardId/widgets', auth, async (req, res) => {
  try {
    const { dashboardId } = req.params;
    const { data, error } = await supabase
      .from('widgets')
      .select('*')
      .eq('dashboard_id', dashboardId)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching widgets:', error);
    res.status(500).json({ error: 'Failed to fetch widgets' });
  }
});

// Add a new widget to a dashboard
router.post('/:dashboardId/widgets', auth, async (req, res) => {
  try {
    const { dashboardId } = req.params;
    const { type, config } = req.body;

    const { data, error } = await supabase
      .from('widgets')
      .insert([
        {
          dashboard_id: dashboardId,
          user_id: req.user.id,
          type,
          config
        }
      ])
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error('Error adding widget:', error);
    res.status(500).json({ error: 'Failed to add widget' });
  }
});

// Update a widget
router.put('/:dashboardId/widgets/:widgetId', auth, async (req, res) => {
  try {
    const { dashboardId, widgetId } = req.params;
    const { type, config } = req.body;

    const { data, error } = await supabase
      .from('widgets')
      .update({ type, config })
      .eq('id', widgetId)
      .eq('dashboard_id', dashboardId)
      .eq('user_id', req.user.id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error('Error updating widget:', error);
    res.status(500).json({ error: 'Failed to update widget' });
  }
});

// Delete a widget
router.delete('/:dashboardId/widgets/:widgetId', auth, async (req, res) => {
  try {
    const { dashboardId, widgetId } = req.params;

    const { error } = await supabase
      .from('widgets')
      .delete()
      .eq('id', widgetId)
      .eq('dashboard_id', dashboardId)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Widget deleted successfully' });
  } catch (error) {
    console.error('Error deleting widget:', error);
    res.status(500).json({ error: 'Failed to delete widget' });
  }
});

module.exports = router; 