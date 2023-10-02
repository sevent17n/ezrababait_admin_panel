FROM node:lts

WORKDIR /app

COPY . .

ENV NODE_ENV=production

RUN yarn

RUN yarn add @nestjs/cli

RUN yarn build

EXPOSE 8000

CMD [ "yarn", "start:prod" ]