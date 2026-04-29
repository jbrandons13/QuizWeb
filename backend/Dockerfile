# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Install build dependencies for native modules (like bcrypt)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install build dependencies for native modules if needed for production install
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install --production

COPY --from=build /app/dist ./dist
# If you have other folders like 'module' that aren't under 'src', 
# they might need to be copied if they aren't included in the build.
# But tsc should include everything imported.
# If you have static assets or other files needed at runtime, copy them here.
# For this project, we might need the .env file if not using environment variables.
# But usually, it's better to pass env vars.

EXPOSE 3000

CMD ["node", "dist/index.js"]
