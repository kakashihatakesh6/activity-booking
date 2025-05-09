FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build TypeScript
RUN npm run build

# Expose the port the app runs on
EXPOSE 5000

# Command to run the app
CMD ["npm", "start"] 