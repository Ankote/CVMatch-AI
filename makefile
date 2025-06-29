all: up

up: build
	docker compose   up

build:
	docker compose   build

down:
	docker compose  down -v

clean: down
	docker compose down --rmi all

re : clean all