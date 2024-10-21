# Use an official Node runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Copy next.config.mjs specifically to ensure it's included
COPY next.config.mjs .

# ATTENTION: Assurez-vous que cette IP correspond à celle du service backend.
# Vous devrez peut-être la mettre à jour si l'IP du service change.
# Utilisez 'kubectl get services' pour vérifier l'IP du service backend.
RUN echo "NEXT_PUBLIC_API_URL=https://dirag-games-api.lab.sspcloud.fr" > .env.local

# Build de l'application
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
