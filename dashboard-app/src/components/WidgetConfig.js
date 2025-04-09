import React, { useState } from 'react';

const WidgetConfig = ({ onSave, onCancel }) => {
  const [type, setType] = useState('');
  const [config, setConfig] = useState({});

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
    // Initialize config with default values based on widget type
    switch (newType) {
      case 'reddit':
        setConfig({
          subreddit: 'programming',
          title: 'Reddit Feed',
          showThumbnails: true,
          collapseAfter: 5
        });
        break;
      default:
        setConfig({});
    }
  };

  const handleConfigChange = (e) => {
    const { name, value, type } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ type, config });
  };

  const renderConfigFields = () => {
    switch (type) {
      case 'reddit':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={config.title || ''}
                onChange={handleConfigChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Widget Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subreddit
              </label>
              <input
                type="text"
                name="subreddit"
                value={config.subreddit || ''}
                onChange={handleConfigChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., programming"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="showThumbnails"
                checked={config.showThumbnails || false}
                onChange={handleConfigChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Show Thumbnails
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of Posts to Show
              </label>
              <input
                type="number"
                name="collapseAfter"
                value={config.collapseAfter || 5}
                onChange={handleConfigChange}
                min="1"
                max="25"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        );

      case 'weather':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={config.location || ''}
                onChange={handleConfigChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="e.g., London, UK"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Units
              </label>
              <select
                name="units"
                value={config.units || 'metric'}
                onChange={handleConfigChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="metric">Metric (°C)</option>
                <option value="imperial">Imperial (°F)</option>
              </select>
            </div>
          </div>
        );

      case 'rss':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Feed URL
              </label>
              <input
                type="url"
                name="feedUrl"
                value={config.feedUrl || ''}
                onChange={handleConfigChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="https://example.com/feed.xml"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maximum Items
              </label>
              <input
                type="number"
                name="maxItems"
                value={config.maxItems || 5}
                onChange={handleConfigChange}
                min="1"
                max="20"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maximum Events
              </label>
              <input
                type="number"
                name="maxEvents"
                value={config.maxEvents || 5}
                onChange={handleConfigChange}
                min="1"
                max="20"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        );

      case 'clock':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Timezone
              </label>
              <input
                type="text"
                name="timezone"
                value={config.timezone || 'local'}
                onChange={handleConfigChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="e.g., America/New_York"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Show Date
              </label>
              <select
                name="showDate"
                value={config.showDate !== undefined ? config.showDate : true}
                onChange={handleConfigChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </div>
          </div>
        );

      case 'todo':
        return (
          <div className="text-gray-500 text-sm">
            No configuration needed for Todo widget
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Add Widget</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Widget Type
            </label>
            <select
              value={type}
              onChange={handleTypeChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a widget type</option>
              <option value="reddit">Reddit Feed</option>
              <option value="weather">Weather</option>
              <option value="rss">RSS Feed</option>
              <option value="calendar">Calendar</option>
              <option value="clock">Clock</option>
              <option value="todo">Todo List</option>
            </select>
          </div>
          {type && renderConfigFields()}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              Add Widget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WidgetConfig; 