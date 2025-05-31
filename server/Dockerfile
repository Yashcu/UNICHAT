# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server code
COPY . .

# Build TypeScript (if needed)
RUN npm run build || true

# Expose the port (default: 5000)
EXPOSE 5000

# Start the server
CMD ["npm", "run", "dev"]
