FROM node:15-alpine
LABEL maintainer "KateAC<alice.catharsis.kate@gmail.com>"
ENV LANG ja-JP.UTF-8

RUN apk update
RUN apk add --no-cache \
  curl \
  curl-dev

RUN mkdir -p /project/app
WORKDIR /project/app

