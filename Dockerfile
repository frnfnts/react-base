FROM node:20-alpine3.17

WORKDIR /app

COPY package-lock.json /app
COPY package.json /app
RUN npm ci
RUN apk add --no-cache git
COPY . /app
CMD ["npm", "run", "start"]

