FROM node:16-bullseye as build

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN yarn install

ARG SERVER_URL=/api
ENV REACT_APP_SERVER_URL=$SERVER_URL

COPY . /app/

RUN yarn build

FROM nginx
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.conf /etc/nginx/nginx.conf

