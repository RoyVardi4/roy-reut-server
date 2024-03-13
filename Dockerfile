FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm i
CMD npx ts-node src/main.ts
EXPOSE 443