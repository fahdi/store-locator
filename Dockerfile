# BlueSky Store Locator - Multi-stage Docker Build
# Stage 1: Build the React client
FROM node:18-alpine AS client-builder

# Set working directory for client build
WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./

# Install client dependencies
RUN npm install

# Copy client source code and config files
COPY client/src ./src
COPY client/public ./public
COPY client/index.html ./
COPY client/vite.config.ts ./
COPY client/tailwind.config.js ./
COPY client/postcss.config.js ./
COPY client/tsconfig*.json ./
COPY client/components.json ./

# Build the React application using production TypeScript config
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S bluesky -u 1001

# Set working directory
WORKDIR /app

# Copy root package files and install root dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy server package files and install server dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --omit=dev

# Return to app root
WORKDIR /app

# Copy server source code
COPY server/ ./server/

# Copy built client application from stage 1
COPY --from=client-builder /app/client/dist ./client/dist

# Create data directory and set permissions
RUN mkdir -p ./server/data && \
    chown -R bluesky:nodejs /app

# Switch to non-root user
USER bluesky

# Expose port 5001 (avoiding port 5000 due to macOS AirPlay conflicts)
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the unified server directly from server directory
WORKDIR /app/server
CMD ["node", "index.js"]