FROM node:22-bullseye-slim

RUN apt-get update && apt-get install -y --no-install-recommends

USER node

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci

RUN npm run build

CMD ["npm", "start"]