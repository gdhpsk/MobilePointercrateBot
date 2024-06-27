FROM node:22
WORKDIR /app
COPY package*.json ./
COPY . .
CMD node index.js
