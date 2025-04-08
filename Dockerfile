# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy built files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public

# Copy configuration
COPY config ./config

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 