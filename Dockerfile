FROM node:18-alpine AS buildfe
WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm install 
COPY ./frontend .
RUN npm run build

FROM node:18-alpine AS buildbe
WORKDIR /app
COPY ./backend/package*.json ./
RUN npm install 
COPY ./backend .
RUN npm run generate-key
RUN npx prisma generate
RUN npm run build

FROM nginx:alpine
WORKDIR /app
COPY --from=buildfe /app/dist /usr/share/nginx/html
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/key ./key
COPY --from=build /app/package*.json ./
COPY supervisord.conf ./
RUN npm install
RUN npx prisma generate
EXPOSE 3000
EXPOSE 80
CMD ["supervisord", "-n"]