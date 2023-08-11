# Makefile for building and running Docker containers
include .env

build:
	docker build --cache-from backend-image -f Dockerfile --target dev -t backend-image .

build-prod:
	docker build --cache-from backend-prod-image -f Dockerfile --target prod -t backend-prod-image .

run:
	docker run -p $(PORT):$(PORT) -v $(PWD):/app -d --name task-flow backend-image

run-prod:
	docker run -p $(PORT):$(PORT) -v $(PWD):/app -d --name task-flow-prod backend-prod-image

clean:
	docker stop $(docker ps -aq)
	docker rm $(docker ps -aq)
	docker rmi backend-image backend-prod-image

stop:
	docker stop $(docker ps -aq)

.PHONY: build run clean stop