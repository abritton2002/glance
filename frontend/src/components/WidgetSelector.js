import React from 'react';

const WidgetSelector = ({ addWidget }) => {
  const widgets = [
    { type: 'reddit', title: 'Reddit Programming', subreddit: 'programming' },
    // Add more widget options here
  ];

  return (
    <div>
      <h2>Select Widgets</h2>
      {widgets.map((widget, index) => (
        <button key={index} onClick={() => addWidget(widget)}>
          Add {widget.title}
        </button>
      ))}
    </div>
  );
};

export default WidgetSelector;
