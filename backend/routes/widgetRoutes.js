const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

// Get all widgets for a dashboard
router.get('/:dashboardId/widgets', async (req, res) => {
  try {
    const { dashboardId } = req.params;
    const { data, error } = await supabase
      .from('widgets')
      .select('*')
      .eq('dashboard_id', dashboardId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching widgets:', error);
    res.status(500).json({ error: 'Failed to fetch widgets' });
  }
});

// Add a new widget to a dashboard
router.post('/:dashboardId/widgets', async (req, res) => {
  try {
    const { dashboardId } = req.params;
    const { type, config } = req.body;

    const { data, error } = await supabase
      .from('widgets')
      .insert([
        {
          dashboard_id: dashboardId,
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
router.put('/:dashboardId/widgets/:widgetId', async (req, res) => {
  try {
    const { dashboardId, widgetId } = req.params;
    const { type, config } = req.body;

    const { data, error } = await supabase
      .from('widgets')
      .update({ type, config })
      .eq('id', widgetId)
      .eq('dashboard_id', dashboardId)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error('Error updating widget:', error);
    res.status(500).json({ error: 'Failed to update widget' });
  }
});

// Delete a widget
router.delete('/:dashboardId/widgets/:widgetId', async (req, res) => {
  try {
    const { dashboardId, widgetId } = req.params;

    const { error } = await supabase
      .from('widgets')
      .delete()
      .eq('id', widgetId)
      .eq('dashboard_id', dashboardId);

    if (error) throw error;
    res.json({ message: 'Widget deleted successfully' });
  } catch (error) {
    console.error('Error deleting widget:', error);
    res.status(500).json({ error: 'Failed to delete widget' });
  }
});

module.exports = router; 