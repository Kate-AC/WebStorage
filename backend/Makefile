t=

.PHONY: command
command:
ifdef t
	docker-compose run --rm app $(t)
endif

.PHONY: build
build:
	docker-compose build --no-cache

.PHONY: run
run:
	-docker network create webstorage
	docker-compose up

.PHONY: down
down:
	docker-compose down

.PHONY: install
install:
	docker-compose run --rm api_gateway_emulator bundle install

.PHONY: dynamo
dynamo:
	open http://localhost:60101/shell/

.PHONY: ngrok
ngrok:
	ngrok http localhost:60102
