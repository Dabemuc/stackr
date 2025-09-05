# --- Build stage ---
FROM node:22-alpine AS builder

# Set working dir
WORKDIR /app

# Define build-time argument
ARG VITE_CLERK_PUBLISHABLE_KEY

# Make it available as an environment variable during build
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

# Install deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Build with production env
ENV NODE_ENV=production
RUN npm run build


# --- Runtime stage ---
FROM node:22-alpine AS runner
WORKDIR /app

# Copy only needed files from builder
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port (TanStack defaults to 3000)
EXPOSE 3000

# Start server
CMD ["node", ".output/server/index.mjs"]
