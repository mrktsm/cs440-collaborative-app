FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY migrations ./migrations
COPY knexfile.js ./knexfile.js

EXPOSE 3000

CMD ["sh", "-c", "npm run migrate && npm start"]
