FROM node:lts-alpine
WORKDIR /kmamiz-web
COPY . .
RUN ["npm", "i"]
RUN ["npm", "run", "build"]
