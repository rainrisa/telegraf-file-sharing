FROM node:slim

WORKDIR /app
COPY package.json yarn.lock ./ 
RUN yarn 
COPY . .

CMD ["yarn", "start"]
