FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
RUN npm run generate-key
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/key ./key
COPY --from=build /app/package*.json ./
RUN npm install --omit=dev
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "start"]