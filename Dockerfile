# Base image with dependencies installed
FROM node:16.15.0 as base

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json /usr/src/app/
RUN npm ci

# Copy the entire application code
COPY . /usr/src/app

FROM gcr.io/cloud-builders/curl
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git

# Development stage
FROM base as dev

# Expose port
EXPOSE 8081

# Start the development server
CMD [ "npm", "run", "dev" ]

# Production stage
FROM base as prod

# Expose port
EXPOSE 8080

# Build dist folder and start the server
RUN npm run build
CMD [ "npm", "run", "start" ]