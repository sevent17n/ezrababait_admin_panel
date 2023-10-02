FROM node:lts

WORKDIR /app

COPY . .

ENV NODE_ENV=production

RUN npm ci --force

RUN npm install -g @nestjs/cli

RUN npm run build

EXPOSE 8000

CMD [ "npm", "run", "start:prod" ]