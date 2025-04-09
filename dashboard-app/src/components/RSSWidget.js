import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RSSWidget = ({ feedUrl, maxItems = 5 }) => {
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await axios.get(`/api/rss/feed?url=${encodeURIComponent(feedUrl)}`);
        setFeed(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch RSS feed');
        setLoading(false);
      }
    };

    fetchFeed();
  }, [feedUrl]);

  if (loading) return <div className="text-center">Loading RSS feed...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!feed) return null;

  return (
    <div className="space-y-4">
      <h4 className="text-xl font-semibold">{feed.title}</h4>
      <div className="space-y-3">
        {feed.items.slice(0, maxItems).map((item, index) => (
          <div key={index} className="border-b border-gray-200 pb-3">
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {item.title}
            </a>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(item.pubDate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RSSWidget; 