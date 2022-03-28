FROM node:lts-alpine
WORKDIR /kmamiz/dist
COPY . .
RUN ["npm", "i"]
RUN ["npm", "run", "build"]
