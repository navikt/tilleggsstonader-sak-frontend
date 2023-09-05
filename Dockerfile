FROM gcr.io/distroless/nodejs:18

WORKDIR /app
COPY ./src/backend server

WORKDIR /app/server

ENV NODE_ENV production
EXPOSE 3000

CMD ["--experimental-modules", "--es-module-specifier-resolution=node", "build/server.js"]