# Use an official Node.js runtime as a parent image
# Using alpine variant for smaller image size
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
# Copying these first leverages Docker layer caching
COPY package*.json ./

# Install app dependencies (including devDependencies for nodemon)
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# The backend server listens on port 5001 (as defined in docker-compose.yml and server.js likely)
EXPOSE 5001

# Command to run the application using nodemon for development
# This matches the command in docker-compose.yml
CMD [ "npm", "run", "dev" ] 