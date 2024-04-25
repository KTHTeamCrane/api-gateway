FROM node:latest

EXPOSE 8000

WORKDIR /server

COPY package.json ./
RUN npm install

COPY . .
CMD ["npm", "run", "dev"]
