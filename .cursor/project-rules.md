# Glance Dashboard Project Rules

## Quick Start Guide

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Docker (optional, for container management)
- Supabase account

### Setup Instructions
1. Clone the repository
2. Copy `.env.example` to `.env` and update the values:
   - Get Supabase credentials from your project settings
   - Set up other environment variables as needed
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Database Structure
The application uses Supabase with the following main tables:

#### public.dashboards
- `id` (UUID): Primary key
- `user_id` (UUID): References auth.users
- `name` (TEXT): Dashboard name
- `is_default` (BOOLEAN): Default dashboard flag
- `layout` (JSONB): Dashboard layout configuration
- Created/Updated timestamps

#### public.widgets
- `id` (UUID): Primary key
- `dashboard_id` (UUID): References dashboards.id
- `user_id` (UUID): References auth.users
- `type` (TEXT): Widget type identifier
- `config` (JSONB): Widget configuration
- `title` (TEXT): Widget title
- `description` (TEXT): Widget description
- `refresh_interval` (INTEGER): Update frequency
- `position` (JSONB): Widget position data
- `style` (JSONB): Widget styling options
- Created/Updated timestamps

## Project Overview
Glance is a user-friendly dashboard application that allows users to create and customize their own dashboards through a simple UI. The application is built on top of the original Glance codebase, which uses YAML configuration and Docker containers.

## Core Principles

### 1. User Experience
- The application must be intuitive and accessible to non-technical users
- All customization options should be available through a graphical interface
- Widgets should be easy to add, remove, and configure
- The dashboard should be responsive and work well on all devices

### 2. Architecture
- Frontend: React-based dashboard application
- Backend: Express.js with Supabase for authentication and data storage
- Database: Supabase for user management and dashboard configurations
- Container Management: Docker for running user dashboards

### 3. Widget Management
- Widgets must be modular and easily extensible
- Each widget type should have its own configuration interface
- Widget data should be cached appropriately to prevent excessive API calls
- Real-time updates should be implemented where appropriate

### 4. Security
- All user data must be properly secured
- Authentication must be handled through Supabase
- API endpoints must be protected with proper authentication
- User sessions must be managed securely

### 5. Code Quality
- Follow React best practices for component structure
- Use functional components with hooks
- Implement proper error handling
- Write comprehensive tests for critical functionality
- Maintain clean and documented code

### 6. Configuration
- Use YAML for initial configuration and defaults
- Allow user preferences to override default configurations
- Store user-specific configurations in Supabase
- Maintain backward compatibility with configuration changes

### 7. Performance
- Optimize widget loading and rendering
- Implement proper caching strategies
- Minimize unnecessary API calls
- Ensure smooth performance with multiple widgets

### 8. Documentation
- Maintain up-to-date documentation for:
  - Installation and setup
  - Widget development
  - API endpoints
  - Configuration options
  - Deployment procedures

## Development Workflow

### 1. Version Control
- Use Git for version control
- Follow feature branch workflow
- Write meaningful commit messages
- Keep the main branch stable

### 2. Testing
- Write unit tests for components
- Implement integration tests for critical flows
- Test on multiple devices and browsers
- Perform regular security audits

### 3. Deployment
- Use CI/CD pipelines for automated testing and deployment
- Maintain separate environments for development, staging, and production
- Implement proper monitoring and logging
- Have a rollback strategy in place

## Widget Development Guidelines

### 1. Structure
- Each widget should be a separate React component
- Widgets should be self-contained and reusable
- Configuration should be handled through props
- State management should be consistent

### 2. Configuration
- Provide sensible defaults
- Allow for customization through the UI
- Validate configuration inputs
- Handle configuration errors gracefully

### 3. Data Management
- Implement proper data fetching and caching
- Handle loading and error states
- Provide refresh mechanisms
- Optimize data updates

## API Guidelines

### 1. Endpoints
- Use RESTful API design principles
- Version API endpoints appropriately
- Document all endpoints
- Implement proper error handling

### 2. Authentication
- Use JWT for authentication
- Implement proper token refresh
- Handle session expiration
- Secure sensitive endpoints

### 3. Rate Limiting
- Implement rate limiting for API endpoints
- Handle rate limit errors gracefully
- Provide appropriate error messages
- Monitor API usage

## UI/UX Guidelines

### 1. Design
- Follow a consistent design system
- Use Tailwind CSS for styling
- Ensure accessibility compliance
- Maintain responsive design

### 2. Interaction
- Provide clear feedback for user actions
- Implement proper loading states
- Handle errors gracefully
- Maintain consistent navigation

### 3. Customization
- Allow for theme customization
- Support widget arrangement
- Provide layout options
- Enable user preferences

## Maintenance

### 1. Updates
- Keep dependencies up to date
- Regularly review and update security measures
- Monitor performance metrics
- Address technical debt

### 2. Support
- Maintain issue tracking
- Provide user support channels
- Document common issues and solutions
- Regular maintenance windows

## Future Considerations

### 1. Scalability
- Plan for increased user base
- Consider horizontal scaling
- Optimize database queries
- Implement caching strategies

### 2. Features
- Regular user feedback collection
- Prioritize feature requests
- Plan for widget expansion
- Consider integration possibilities

### 3. Technology
- Stay current with React updates
- Evaluate new technologies
- Consider performance improvements
- Plan for future upgrades 