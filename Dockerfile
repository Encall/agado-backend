# Fetching the minified node image on apline linux
FROM node:21-slim

# Declaring env
ENV NODE_ENV production

# Setting up the work directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml before other files
# Utilize Docker cache to save re-installing dependencies if unchanged
COPY package*.json pnpm-lock.yaml ./

# Installing pnpm and dependencies
RUN npm install -g pnpm && pnpm install --prod

# Copy all other files in our project
COPY . .

# Starting our application
CMD [ "node", "src/index.js" ]

# Exposing server port
EXPOSE 3000