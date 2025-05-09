FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build TypeScript (including copy-views script)
RUN npm run build

# Ensure views directory exists in dist (as a backup)
RUN mkdir -p /app/dist/src/views
RUN if [ ! -f /app/dist/src/views/welcome.html ]; then cp -r /app/src/views/* /app/dist/src/views/; fi

# Expose the port the app runs on
EXPOSE 5000

# Command to run the app
CMD ["npm", "start"] 