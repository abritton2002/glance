const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/dashboards', require('./routes/dashboardRoutes'));
app.use('/api/rss', require('./routes/rssRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/calendar', require('./routes/calendarRoutes'));
app.use('/api/todos', require('./routes/todoRoutes'));
app.use('/api/widgets', require('./routes/widgetRoutes'));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running with Supabase!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;