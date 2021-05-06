FROM ruby:2.7.1-alpine
LABEL maintainer "Kate-AC<alice.catharsis.kate@gmail.com>"

RUN mkdir -p /project/api_gateway_emulator
WORKDIR /project/api_gateway_emulator

RUN apk update
RUN apk add --no-cache \
  bash \
  curl \
  linux-headers \
  libxml2-dev \
  make \
  gcc \
  g++ \
  libc-dev \
  nodejs \
  tzdata \
  mysql-client \
  mysql-dev \
  postgresql-client \
  postgresql-dev \
  git \
  sqlite \
  sqlite-dev \
  yarn

COPY ./api_gateway_emulator/Gemfile .
RUN bundle install
RUN yarn install
