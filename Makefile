# Makefile for building and running Docker containers

# Development
dev-build:
	docker build -f Dockerfile -t backend-image .

dev-run:
	docker run -p 3535:3535 -v $(PWD):/app -d --name task-flow backend-image

# Production
prod-build:
	docker build -f Dockerfile.prod -t backend-prod-image .

prod-run:
	docker run -p 3535:3535 -d --name task-flow-prod backend-prod-image

clean:
	docker stop $(docker ps -aq)
	docker rm $(docker ps -aq)
	docker rmi backend-dev-image backend-prod-image

stop:
	docker stop $(docker ps -aq)

.PHONY: dev-build dev-run prod-build prod-run clean stop