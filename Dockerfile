# Use an official Node.js runtime as a base image
FROM node:20.10

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy .env file to the working directory
COPY .env .env

# Install app dependencies
RUN npm install

# Copy the application code to the container
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Define the command to run your app
CMD ["node", "server.js"]
