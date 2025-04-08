import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [widgets, setWidgets] = useState([]);
  const { logout } = useAuth();

  const addWidget = (type) => {
    const newWidget = {
      id: Date.now(),
      type,
      title: type === 'reddit' ? 'Programming Updates' : 'New Widget'
    };
    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (id) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
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
                onClick={logout}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-4 sm:px-0">
          <div className="mb-6">
            <button
              onClick={() => addWidget('reddit')}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Add Reddit Widget
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {widgets.map(widget => (
              <div
                key={widget.id}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {widget.title}
                    </h3>
                    <button
                      onClick={() => removeWidget(widget.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="h-32 flex items-center justify-center text-gray-500">
                    Widget Content Coming Soon
                  </div>
                </div>
              </div>
            ))}
          </div>

          {widgets.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              Add widgets to customize your dashboard
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 