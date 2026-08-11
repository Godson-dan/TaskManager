# Stage 1: Build the React/Vite application
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the application source code
COPY . .

# Build the Vite application
RUN npm run build


# Stage 2: Serve the built application with Nginx
FROM nginx:alpine

# Remove Nginx's default website
RUN rm -rf /usr/share/nginx/html/*

# Copy the Vite build output into Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
