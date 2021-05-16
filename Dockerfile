FROM node:lts-alpine3.13
RUN mkdir -p /app
COPY src /app 
WORKDIR /app
RUN npm install
EXPOSE 1234
CMD npm start

