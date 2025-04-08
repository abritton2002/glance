import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import RedditWidget from './RedditWidget';
import WeatherWidget from './WeatherWidget';
import RSSWidget from './RSSWidget';
import CalendarWidget from './CalendarWidget';
import ClockWidget from './ClockWidget';
import TodoWidget from './TodoWidget';
import WidgetConfig from './WidgetConfig';
import axios from 'axios';

const Dashboard = () => {
  const [widgets, setWidgets] = useState([]);
  const [showConfig, setShowConfig] = useState(false);
  const { user } = useAuth();
  const [dashboardId, setDashboardId] = useState(null);

  useEffect(() => {
    // First, get or create default dashboard
    const initializeDashboard = async () => {
      try {
        const response = await axios.get('/api/dashboards/default');
        setDashboardId(response.data.id);
        return response.data.id;
      } catch (err) {
        console.error('Failed to get default dashboard:', err);
      }
    };

    // Then load widgets for that dashboard
    const loadWidgets = async (id) => {
      try {
        const response = await axios.get(`/api/widgets/${id}/widgets`);
        setWidgets(response.data);
      } catch (err) {
        console.error('Failed to load widgets:', err);
      }
    };

    if (user) {
      initializeDashboard().then(id => {
        if (id) loadWidgets(id);
      });
    }
  }, [user]);

  const addWidget = async (config) => {
    if (!dashboardId) return;
    try {
      const response = await axios.post(`/api/widgets/${dashboardId}/widgets`, config);
      setWidgets([...widgets, response.data]);
      setShowConfig(false);
    } catch (err) {
      console.error('Failed to add widget:', err);
    }
  };

  const removeWidget = async (id) => {
    if (!dashboardId) return;
    try {
      await axios.delete(`/api/widgets/${dashboardId}/widgets/${id}`);
      setWidgets(widgets.filter(widget => widget.id !== id));
    } catch (err) {
      console.error('Failed to remove widget:', err);
    }
  };

  const renderWidget = (widget) => {
    switch (widget.type) {
      case 'reddit':
        return <RedditWidget subreddit={widget.config.subreddit} />;
      case 'weather':
        return <WeatherWidget location={widget.config.location} units={widget.config.units} />;
      case 'rss':
        return <RSSWidget feedUrl={widget.config.feedUrl} maxItems={widget.config.maxItems} />;
      case 'calendar':
        return <CalendarWidget maxEvents={widget.config.maxEvents} />;
      case 'clock':
        return <ClockWidget timezone={widget.config.timezone} showDate={widget.config.showDate} />;
      case 'todo':
        return <TodoWidget />;
      default:
        return <div>Unknown widget type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Glance Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setShowConfig(true)}
                className="mr-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Widget
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-4 sm:px-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {widgets.map(widget => (
              <div
                key={widget.id}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-4">
                  {renderWidget(widget)}
                  <button
                    onClick={() => removeWidget(widget.id)}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showConfig && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium mb-4">Add New Widget</h2>
            <WidgetConfig
              onSave={addWidget}
              onCancel={() => setShowConfig(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 