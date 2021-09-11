FROM node:14.17-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add tzdata \
  && cp /usr/share/zoneinfo/Europe/Istanbul /etc/localtime \
  && echo "Europe/Istanbul" >  /etc/timezone \
  && npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
