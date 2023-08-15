# TaskFlow Backend

![Cloud Build](https://storage.googleapis.com/task-flow-services-badges/builds/KhallilB/TaskFlow-Backend/branches/main.svg) [![codecov](https://codecov.io/gh/KhallilB/TaskFlow-Backend/graph/badge.svg?token=9NRHNRUK82)](https://codecov.io/gh/KhallilB/TaskFlow-Backend) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Welcome to the backend repository of TaskFlow, an enterprise task management system. This repository contains the server-side components of the TaskFlow application, built with Node.js, Express.js, JWT authentication, MongoDB as the database, Mongoose as the ODM, and Postman for API documentation.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Testing](#testing)
  - [Writing Tests with Jest](#writing-tests-with-jest)
  - [Tracking Code Coverage with Codecov](#tracking-code-coverage-with-codecov)
  - [Benefits of Jest and Codecov](#benefits-of-jest-and-codecov)
- [Deployment](#deployment)
  - [Building the Docker Image](#building-the-docker-image)
  - [Container Registry and Cloud Build](#container-registry-and-cloud-build)
  - [Deploying to Cloud Run](#deploying-to-cloud-run)
  - [Benefits and Scalability](#benefits-and-scalability)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

- Node.js (recommended version: 16.15.0)
- npm or yarn package manager
- Docker
- MongoDB 

### Installation

1. Clone this repository:
```sh
git clone https://github.com/KhallilB/taskflow-backend.git
cd taskflow-backend
```

2. Install dependencies:
```sh
npm install
# or
yarn install
```

3. Configure environment variables:

- Copy .env.example to .env and provide the necessary configuration values.

### Development Build
Build the development container:
```sh
make build
# or
docker build --cache-from backend-image -f Dockerfile --target dev -t backend-image .
```

Start the server:
```sh
make run
# or 
docker run -p $(PORT):$(PORT) -v $(PWD):/app -d --name task-flow backend-image
```

<br />

### Production Build
Build the container:
```sh
make build-prod
# or
docker build --cache-from backend-prod-image -f Dockerfile --target prod -t backend-prod-image .
```

<br />

Start the server:
```sh
make run-prod
# or
docker run -p $(PORT):$(PORT) -v $(PWD):/app -d --name task-flow-prod backend-prod-image
```

### Additionally
You can stop the servers using:
```sh
make stop
# or
docker stop $(docker ps -aq)
```

<br />

You can clean the containers using the clean command:
```sh
make clean
# or
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker rmi backend-image backend-prod-image
```

## Features
- Authentication and user management using JWT.
- CRUD operations for projects, tasks, comments, and notifications.
- Role-based access control (RBAC) to manage user permissions.
- API documentation for clear and comprehensive endpoint information.
- Secure password hashing and token-based authentication.

<br />

## API Documentation:
https://documenter.getpostman.com/view/5869333/2s9Xy6qq63

<br />

## Security
The backend is designed with security in mind. It includes measures such as input validation, data sanitization, protection against common vulnerabilities (XSS), and HTTPS communication.

## Testing
Testing is a critical aspect to ensure the reliability and stability of the code. We use Jest, a popular JavaScript testing framework that provides an intuitive and comprehensive platform for writing and running tests.

<br />

<h3 align="center">TaskFlow Backend Test Coverage</h3>
<p align="center">
  <img src="https://codecov.io/gh/KhallilB/TaskFlow-Backend/graphs/sunburst.svg?token=9NRHNRUK82" alt="Code Cov Graph"/>
</p>
<p align="center">
The inner-most circle is the entire project, moving away from the center are folders then, finally, a single file. The size and color of each slice is representing the number of statements and the coverage, respectively.
</p

<br />
<br />

### Writing Tests with Jest
Jest simplifies the process of writing tests by offering an easy-to-use syntax and a wide range of testing utilities. You can write unit tests, integration tests, and even end-to-end tests using Jest. Each test typically focuses on a specific function, component, or module within your application.

<br />

### Tracking Code Coverage with Codecov
Code coverage is a measure of how much of your codebase is exercised by your tests. It helps you identify untested or insufficiently tested parts of your application. Codecov is a tool that allows you to track and visualize code coverage over time.

<br />

### Benefits of Jest and Codecov
By using Jest for testing and Codecov for code coverage tracking, we achieve the following benefits:

#### - Comprehensive Testing:
Jest's rich features enables the ability to thoroughly test code, from individual functions to complex components.

#### - Code Confidence: 
With Jest's assertions and matchers, you can have confidence that your code behaves as expected.

#### - Visibility:
Codecov's reports provide insights into your code coverage, helping to identify areas that require additional testing.

#### - Continuous Improvement:
Monitoring code coverage over time allows to incrementally improve the testing strategy and overall code quality.

<br />

## Deployment
The application is deployed with Docker, Cloud Build, and Cloud Run, that streamline the process of building, containerizing, and deploying the application to a scalable cloud environment.

### Building the Docker Image
Docker allows you to encapsulate your application and its dependencies into a single container using instructions. These instructions set up the environment, copy your application code, install dependencies, and configure runtime settings.

Once the Dockerfile is defined, docker build command to generate an image. This image is a self-sufficient unit that packages everything the application needs to run consistently across different environments.

<br />

### Container Registry and Cloud Build
To make your Docker image available for deployment, we need to push it to a container registry in this case Google Artifact Registry. Container registries are secure repositories that store and manage Docker images.

Google Cloud Build seamlessly integrates with the repository and container registry. When changes are pushed to your repository, Cloud Build automatically triggers a build process defined in ```./workfows/cloudbuild.yaml``` configuration file. This file outlines the build steps, including building the Docker image using the Dockerfile.

<br />

### Deploying to Cloud Run
Once your Docker image is built and stored in the container registry, it is deployed using Google Cloud Run. Cloud Run is a fully managed compute platform that automatically scales stateless containers. It abstracts away the operational complexity, enabling you to focus on writing code.

Deploying to Cloud Run is a straightforward process. You define a service using the gcloud run deploy command or the Google Cloud Console. You specify your Docker image, set environment variables, and configure resources. Cloud Run creates instances of your container image and automatically manages scaling based on incoming traffic.

<br />

### Benefits and Scalability
By following this deployment approach, you're benefiting from the strengths of Docker, Cloud Build, and Cloud Run:

#### - Consistency: 
Docker ensures that your application runs consistently across development, testing, and production environments.

#### - Automation: 
Cloud Build automates the building and updating of your Docker images whenever changes are made, ensuring a reliable and reproducible process.

#### - Scalability: 
Cloud Run scales your application automatically in response to incoming traffic, handling peaks and troughs without manual intervention.

#### - Simplicity:
 The combination of these tools abstracts away much of the operational complexity, allowing you to focus on writing code and delivering features.

<br />

This is a deployment pipeline that takes code changes, builds them into Docker images, and deploys them as scalable services on Google Cloud Run. This approach not only simplifies deployment but also allows the application to adapt seamlessly to varying workloads and user demands.

## Contributing
Contributions are welcome! If you'd like to contribute to the project, please follow the guidelines outlined in the Contributing Guidelines.

## License
This project is licensed under the MIT License.