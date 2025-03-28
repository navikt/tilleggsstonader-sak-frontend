FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /app
COPY ./src/backend server
COPY ./dist_production build

WORKDIR /app/server

ENV NODE_ENV=production
EXPOSE 3000

CMD ["--import=./build/register.js","--es-module-specifier-resolution=node", "./build/server.js"]