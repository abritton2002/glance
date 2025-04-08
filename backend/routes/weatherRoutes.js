const express = require('express');
const router = express.Router();
const axios = require('axios');

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

router.get('/', async (req, res) => {
  try {
    const { location, units } = req.query;
    if (!location) {
      return res.status(400).json({ error: 'Location is required' });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=${units}&appid=${OPENWEATHER_API_KEY}`
    );

    const data = response.data;
    const weather = {
      location: data.name,
      temperature: data.main.temp,
      feels_like: data.main.feels_like,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      pressure: data.main.pressure,
      visibility: data.visibility
    };

    res.json(weather);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

module.exports = router; 