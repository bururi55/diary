FROM node:22

WORKDIR /user/src/app

COPY . .

WORKDIR /user/src/app/frontend
RUN npm i
RUN npm run build

WORKDIR /user/src/app/backend
RUN npm i

EXPOSE 5000

CMD ["node", "app.js"]