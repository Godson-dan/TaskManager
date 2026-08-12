#Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install deps first 
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code of the project into the app directory
COPY . .
RUN npm run build

#Production stage
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Only install production deps
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/main.js"]