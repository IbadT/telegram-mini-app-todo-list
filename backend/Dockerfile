FROM node:18-alpine

WORKDIR /app

# Устанавливаем необходимые зависимости
# RUN apk add --no-cache python3 make g++ openssl openssl-dev
# RUN apk add --no-cache make gcc g++ python3
RUN apk add --no-cache openssl openssl-dev python3 make g++ libc6-compat



COPY package*.json ./

# Устанавливаем bcrypt отдельно перед остальными зависимостями
RUN npm install bcrypt --build-from-source

RUN npm install

COPY . .

# Генерируем Prisma клиент после копирования всех файлов
RUN npx prisma generate

RUN npm run build

EXPOSE 3000

# CMD ["node", "dist/src/main"] 
CMD ["npm", "run", "start:dev"] 