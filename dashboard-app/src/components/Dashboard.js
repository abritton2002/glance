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
import { supabase } from '../contexts/AuthContext';

const Dashboard = () => {
  const [widgets, setWidgets] = useState([]);
  const [showConfig, setShowConfig] = useState(false);
  const { user, logout } = useAuth();
  const [dashboardId, setDashboardId] = useState(null);
  const [token, setToken] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setToken(session.access_token);
      }
    };
    getToken();
  }, [user]);

  useEffect(() => {
    // First, get or create default dashboard
    const initializeDashboard = async () => {
      try {
        const response = await axios.get('/api/dashboards/default', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data) {
          setDashboardId(response.data.id);
          return response.data.id;
        }
        throw new Error('No dashboard data received');
      } catch (err) {
        console.error('Failed to get default dashboard:', err);
        if (err.response) {
          console.error('Server response:', err.response.data);
        }
        return null;
      }
    };

    // Then load widgets for that dashboard
    const loadWidgets = async (id) => {
      if (!id || !token) return;
      try {
        const response = await axios.get(`/api/widgets/${id}/widgets`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data) {
          setWidgets(response.data);
        }
      } catch (err) {
        console.error('Failed to load widgets:', err);
        if (err.response) {
          console.error('Server response:', err.response.data);
        }
      }
    };

    if (user && token) {
      initializeDashboard().then(id => {
        if (id) loadWidgets(id);
      });
    }
  }, [user, token]);

  const addWidget = async (config) => {
    if (!dashboardId || !token) return;
    try {
      const response = await axios.post(`/api/widgets/${dashboardId}/widgets`, config, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setWidgets([...widgets, response.data]);
      setShowConfig(false);
    } catch (err) {
      console.error('Failed to add widget:', err);
      if (err.response) {
        console.error('Server response:', err.response.data);
      }
    }
  };

  const removeWidget = async (id) => {
    if (!dashboardId || !token) return;
    try {
      await axios.delete(`/api/widgets/${dashboardId}/widgets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setWidgets(widgets.filter(widget => widget.id !== id));
    } catch (err) {
      console.error('Failed to remove widget:', err);
      if (err.response) {
        console.error('Server response:', err.response.data);
      }
    }
  };

  const renderWidget = (widget) => {
    switch (widget.type) {
      case 'reddit':
        return <RedditWidget 
          title={widget.config.title}
          subreddit={widget.config.subreddit}
          showThumbnails={widget.config.showThumbnails}
          collapseAfter={widget.config.collapseAfter}
        />;
      case 'weather':
        return <WeatherWidget 
          location={widget.config.location}
          units={widget.config.units}
        />;
      case 'rss':
        return <RSSWidget 
          feedUrl={widget.config.feedUrl}
          maxItems={widget.config.maxItems}
        />;
      case 'calendar':
        return <CalendarWidget 
          maxEvents={widget.config.maxEvents}
        />;
      case 'clock':
        return <ClockWidget 
          timezone={widget.config.timezone}
          showDate={widget.config.showDate}
        />;
      case 'todo':
        return <TodoWidget />;
      default:
        return <div>Unknown widget type: {widget.type}</div>;
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
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  <span>{user?.email}</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-4 sm:px-0">
          {!user && <div>Please log in to view your dashboard</div>}
          {user && widgets.length === 0 && <div>No widgets configured. Add some widgets to get started!</div>}
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