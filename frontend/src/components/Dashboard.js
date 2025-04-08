import React, { useState } from 'react';
import WidgetSelector from './WidgetSelector';

const Dashboard = () => {
  const [widgets, setWidgets] = useState([]);

  const addWidget = (widget) => {
    setWidgets([...widgets, widget]);
  };

  return (
    <div>
      <h1>Your Dashboard</h1>
      <WidgetSelector addWidget={addWidget} />
      <div>
        {widgets.map((widget, index) => (
          <div key={index}>
            <h3>{widget.title}</h3>
            {/* Render widget based on type */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
