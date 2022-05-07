FROM node:16 as builder
WORKDIR /usr/src/app
COPY . .

RUN npm install
RUN npm run build

FROM node:16
WORKDIR /usr/src/app
EXPOSE 4000

COPY package.json ./
COPY package-lock.json ./
RUN npm install --production

RUN mkdir dist
COPY .env ./
COPY --from=builder /usr/src/app/dist/ /usr/src/app/dist

CMD ["node", "dist/src/app.js"]