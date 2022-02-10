FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install nodemon prisma class-validator class-transformer --save-dev

COPY . .

RUN npx prisma migrate dev --name initialize_db

EXPOSE 5000

CMD ["npm", "run", "dev"]
