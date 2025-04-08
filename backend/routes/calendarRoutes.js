const express = require('express');
const router = express.Router();

// Basic calendar route
router.get('/events', (req, res) => {
  try {
    // Return mock data for now
    const events = [
      {
        id: 1,
        title: 'Team Meeting',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
        description: 'Weekly team sync'
      },
      {
        id: 2,
        title: 'Project Review',
        start: new Date(Date.now() + 86400000).toISOString(),
        end: new Date(Date.now() + 90000000).toISOString(),
        description: 'Project status review'
      }
    ];

    res.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
});

module.exports = router; 