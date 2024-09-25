# Stage 1: Build the Next.js application
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Install only production dependencies to reduce image size
RUN npm install --only=production

# Pass environment variables at build time
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copy the rest of the application code to the container
COPY . .

# Build the Next.js app for production
RUN npm run build

# Stage 2: Run the Next.js app in production
FROM node:18-slim

# Set the working directory
WORKDIR /app

# Copy over only the production dependencies and the build output
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next

# Expose the port the app will run on
EXPOSE 3000

# Run Next.js in production mode
CMD ["npm", "run", "start"]
