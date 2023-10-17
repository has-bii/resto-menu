FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm run install-all
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/.env ./
COPY --from=build /app/prisma ./prisma
COPY package*.json ./
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "start"]