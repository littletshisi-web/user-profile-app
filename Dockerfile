# Multi-stage build for optimized production image
# Stage 1: Build dependencies
FROM node:25-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: Production image
FROM node:25-alpine

WORKDIR /app

# Install dumb-init to handle signals properly (ensures clean shutdowns)
RUN apk add --no-cache dumb-init

# Copy node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY . .

# Create non-root user for security (don't run as root)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port (documented, not enforced)
EXPOSE 3000

# Use dumb-init to handle signals (SIGTERM, SIGINT)
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "servers.js"]

# Health check (Docker will periodically run this to monitor app health)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"
