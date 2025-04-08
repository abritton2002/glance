import React, { useState, useEffect } from 'react';

const ClockWidget = ({ timezone = 'local', showDate = true }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: timezone === 'local' ? undefined : timezone
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: timezone === 'local' ? undefined : timezone
    });
  };

  return (
    <div className="text-center space-y-2">
      <div className="text-4xl font-bold text-gray-900">
        {formatTime(time)}
      </div>
      {showDate && (
        <div className="text-lg text-gray-600">
          {formatDate(time)}
        </div>
      )}
      {timezone !== 'local' && (
        <div className="text-sm text-gray-500">
          {timezone}
        </div>
      )}
    </div>
  );
};

export default ClockWidget; 