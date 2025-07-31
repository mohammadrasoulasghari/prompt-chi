# Multi-stage build for React app with Vite

# Build stage - compile the application
FROM node:20-alpine as builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Build application
COPY . .
RUN npm run build

# Production stage - serve the built app
FROM node:20-alpine
WORKDIR /app

# Install runtime dependencies
COPY package*.json ./
RUN npm ci

# Copy build artifacts
COPY --from=builder /app/dist ./dist

# Configure environment
ENV PORT=4173
ENV HOST=0.0.0.0

# Expose port and start app
EXPOSE $PORT
CMD ["npm", "run", "preview"]
