FROM node

EXPOSE 8000

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

CMD ["node", "--env-file=.env", "server.js"]

