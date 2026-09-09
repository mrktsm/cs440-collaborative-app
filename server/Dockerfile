FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY knexfile.js ./
COPY migrations ./migrations

EXPOSE 3000

CMD ["npm", "start"]
