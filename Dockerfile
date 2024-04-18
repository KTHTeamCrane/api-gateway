FROM node

EXPOSE 8000

WORKDIR /app
COPY . .

RUN npm install

CMD ["node", "--env-file=.env", "server.js"]

