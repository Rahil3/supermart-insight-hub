# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine
WORKDIR /app

# Install serve to host the static files
RUN npm install -g serve

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Expose port 8080
EXPOSE 8080

# Serve the built application
CMD ["serve", "-s", "dist", "-l", "8080"]
