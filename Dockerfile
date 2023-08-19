# syntax=docker/dockerfile:1

FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080
CMD ["node", ".output/server/index.mjs"]