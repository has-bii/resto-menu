FROM node:18-alpine AS build
WORKDIR /app
COPY ./backend/package*.json ./
RUN npm install
COPY ./backend .
RUN npm run generate-key
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/key ./key
COPY package*.json ./
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "start"]