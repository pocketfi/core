FROM node:15

WORKDIR /core

COPY package*.json ./
COPY tsconfig.json ./

COPY . .

ENV NODE_ENV=dev
RUN npm install
RUN npm run build
COPY .env.dev ./dist/
WORKDIR ./dist

EXPOSE 5000

CMD node server.js