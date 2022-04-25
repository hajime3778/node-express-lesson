FROM node:16 as builder
WORKDIR /usr/src/app
COPY . .

RUN npm install
RUN npm run build

FROM node:16
WORKDIR /usr/src/app
EXPOSE 4000

RUN mkdir dist node_modules
COPY .env ./
COPY --from=builder /usr/src/app/dist/ /usr/src/app/dist
COPY --from=builder /usr/src/app/node_modules/ /usr/src/app/node_modules

CMD ["node", "dist/src/app.js"]