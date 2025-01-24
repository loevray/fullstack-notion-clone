# Use Node.js as the base image
FROM node:20.9.0

# Set the working directory
WORKDIR /web-server

# Copy only necessary files
COPY package*.json ./
RUN npm install

# Copy the rest of the server files
COPY . .

# Expose the port the web server runs on
EXPOSE 3000

# Start the web server
CMD ["npm", "start"]
