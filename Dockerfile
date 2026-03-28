FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source
COPY backend/src ./src

# Expose port
EXPOSE 3001

# Start command
CMD ["node", "src/index.js"]
