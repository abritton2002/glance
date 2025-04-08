import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CalendarWidget = ({ maxEvents = 5 }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/calendar/events');
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch calendar events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="text-center">Loading calendar events...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!events.length) return <div className="text-center text-gray-500">No upcoming events</div>;

  return (
    <div className="space-y-4">
      <h4 className="text-xl font-semibold">Upcoming Events</h4>
      <div className="space-y-3">
        {events.slice(0, maxEvents).map((event, index) => (
          <div key={index} className="border-b border-gray-200 pb-3">
            <h5 className="font-medium text-gray-900">{event.title}</h5>
            <div className="text-sm text-gray-600 mt-1">
              <div>
                <span className="font-medium">Start:</span>{' '}
                {new Date(event.start).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">End:</span>{' '}
                {new Date(event.end).toLocaleString()}
              </div>
            </div>
            {event.description && (
              <p className="text-sm text-gray-500 mt-2">
                {event.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWidget; 