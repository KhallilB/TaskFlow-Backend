# Use a Node.js base image suitable for development
FROM node:16.15.0

# Set the working directory within the container
WORKDIR /usr/src/app

# Copy package files to the container
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm install

# Copy the entire application code
COPY . .

# Expose port for development server
EXPOSE 3535

# Start the application using nodemon for hot reloading
CMD [ "npm", "run", "dev" ]