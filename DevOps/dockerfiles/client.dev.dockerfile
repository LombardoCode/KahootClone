FROM node:24.8.0-alpine
WORKDIR /app

COPY client/package*.json ./
RUN npm install --legacy-peer-deps

COPY client/. .

EXPOSE 3000
CMD ["npm", "run", "dev"]
