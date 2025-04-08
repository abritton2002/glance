# Glance Dashboard

A personalized dashboard application that allows users to create and customize their own dashboard with various widgets.

## Features

- User authentication and authorization
- Drag-and-drop widget layout system
- Multiple widget types:
  - Reddit feed
  - Weather information
  - RSS feed reader
  - Calendar events
  - Clock with timezone support
  - Todo list
- Real-time data updates
- Responsive design
- Docker container support

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- Supabase account
- OpenWeather API key (for weather widget)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/glance.git
   cd glance
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   OPENWEATHER_API_KEY=your_openweather_api_key
   ```

3. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../dashboard-app
   npm install
   ```

4. Start the development environment:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend development server
   cd ../dashboard-app
   npm start
   ```

   Or using Docker Compose:
   ```bash
   docker-compose up
   ```

## Development

### Backend

The backend is built with Express.js and uses Supabase for data storage. Key features include:

- RESTful API endpoints
- Authentication middleware
- Widget-specific routes
- YAML configuration system
- Docker container management

### Frontend

The frontend is built with React and Tailwind CSS. Key features include:

- Responsive design
- Widget components
- Drag-and-drop interface
- Real-time updates
- User authentication

## Widget Configuration

Each widget type has its own configuration options:

- **Reddit Widget**: Configure subreddit name
- **Weather Widget**: Configure location and units (metric/imperial)
- **RSS Widget**: Configure feed URL and maximum items
- **Calendar Widget**: Configure maximum events to display
- **Clock Widget**: Configure timezone and date display
- **Todo Widget**: No configuration needed

## Deployment

1. Build the Docker images:
   ```bash
   docker-compose build
   ```

2. Start the containers:
   ```bash
   docker-compose up -d
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 