import React, { useState } from 'react';

const widgetTypes = {
  reddit: {
    name: 'Reddit Feed',
    fields: [
      {
        name: 'subreddit',
        label: 'Subreddit',
        type: 'text',
        placeholder: 'e.g. programming',
        default: 'programming'
      }
    ]
  }
};

const WidgetConfig = ({ onSave, onCancel }) => {
  const [widgetType, setWidgetType] = useState('reddit');
  const [subreddit, setSubreddit] = useState('programming');

  const handleSubmit = (e) => {
    e.preventDefault();
    let config;
    
    switch (widgetType) {
      case 'reddit':
        config = { subreddit };
        break;
      default:
        config = {};
    }

    onSave({
      type: widgetType,
      config
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Add Widget</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Widget Type
              </label>
              <select
                value={widgetType}
                onChange={(e) => setWidgetType(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="reddit">Reddit</option>
              </select>
            </div>

            {widgetType === 'reddit' && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Subreddit
                </label>
                <input
                  type="text"
                  value={subreddit}
                  onChange={(e) => setSubreddit(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter subreddit name"
                />
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add Widget
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WidgetConfig; 