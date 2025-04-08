import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherWidget = ({ location, units = 'metric' }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`/api/weather?location=${location}&units=${units}`);
        setWeather(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch weather data');
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location, units]);

  if (loading) return <div className="text-center">Loading weather data...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!weather) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-semibold">{weather.location}</h4>
        <span className="text-2xl font-bold">{weather.temperature}°{units === 'metric' ? 'C' : 'F'}</span>
      </div>
      <div className="flex items-center space-x-2">
        <img 
          src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
          alt={weather.description}
          className="w-12 h-12"
        />
        <span className="text-lg capitalize">{weather.description}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">Feels like:</span>
          <span className="ml-2">{weather.feelsLike}°{units === 'metric' ? 'C' : 'F'}</span>
        </div>
        <div>
          <span className="text-gray-500">Humidity:</span>
          <span className="ml-2">{weather.humidity}%</span>
        </div>
        <div>
          <span className="text-gray-500">Wind:</span>
          <span className="ml-2">{weather.windSpeed} {units === 'metric' ? 'm/s' : 'mph'}</span>
        </div>
        <div>
          <span className="text-gray-500">Pressure:</span>
          <span className="ml-2">{weather.pressure} hPa</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget; 