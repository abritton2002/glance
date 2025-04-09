# Use an official Node.js runtime as a parent image
# Using alpine variant for smaller image size
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
# We need all dependencies for the react-scripts start command
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Create React App development server runs on port 3000
EXPOSE 3000

# Command to run the development server
# This matches the "start" script in package.json
CMD ["npm", "start"] 