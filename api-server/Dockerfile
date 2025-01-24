# Use Node.js as the base image
FROM node:20.9.0

# Set the working directory
WORKDIR /api-server

# Copy only necessary files
COPY package*.json ./
RUN npm install

# Copy the rest of the server files
COPY . .

# Expose the port the API server runs on
EXPOSE 4000

# Start the API server
CMD ["npm", "start"]
