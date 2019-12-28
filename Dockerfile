FROM node:10

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm ci

EXPOSE 8080

CMD [ "npm", "run", "start" ]
