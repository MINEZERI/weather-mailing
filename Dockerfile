FROM node:20
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install
RUN npx prisma generate

COPY . .
COPY .env .

RUN npm run build

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/app.js"]