FROM node:16-bullseye

WORKDIR /test-suite

COPY ./package.json /test-suite/package.json
COPY ./yarn.lock /test-suite/yarn.lock

RUN yarn install

COPY ./cypress /test-suite/cypress

RUN yarn run cy:run
