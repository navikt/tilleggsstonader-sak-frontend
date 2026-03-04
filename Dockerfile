FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim

WORKDIR /app
COPY ./src/backend server
COPY ./dist_production build

WORKDIR /app/server

ENV NODE_ENV=production
EXPOSE 3000

CMD ["--import=./build/register.js","--es-module-specifier-resolution=node", "./build/server.js"]