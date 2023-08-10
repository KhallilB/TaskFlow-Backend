# TaskFlow Backend

Welcome to the backend repository of TaskFlow, an enterprise task management system. This repository contains the server-side components of the TaskFlow application, built with Node.js, Express.js, JWT authentication, MongoDB as the database, Mongoose as the ODM, and GraphQL for API documentation.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Deployment](#deployment)
  - [Docker](#docker)
  - [Kubernetes](#kubernetes)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

- Node.js (recommended version: 16.15.0)
- npm or yarn package manager
- Docker
- MongoDB 

### Installation

Clone this repository:
```sh
git clone https://github.com/KhallilB/taskflow-backend.git
cd taskflow-backend
```

Install dependencies:
```sh
npm install
# or
yarn install
```

Configure environment variables:

- Copy .env.example to .env and provide the necessary configuration values.

#### Development
Build the development container:
```sh
make dev-build
```

Start the server
```sh
make dev-run 
```

## Features
- Authentication and user management using JWT.
- CRUD operations for projects, tasks, comments, and notifications.
- Role-based access control (RBAC) to manage user permissions.
- API documentation for clear and comprehensive endpoint information.
- Secure password hashing and token-based authentication.

## API Documentation
API documentation is available through GraphQL queries. You can access the API documentation at /graphql endpoint when the server is running.

## Security
The backend is designed with security in mind. It includes measures such as input validation, data sanitization, protection against common vulnerabilities (XSS), and HTTPS communication.

## Deployment

### Docker
- Dockerize the backend application for consistent deployment across environments.
- Use Docker Compose for managing multi-container applications.

### Kubernetes
- Deploy the Dockerized backend application to Kubernetes clusters.
- Utilize Kubernetes features for scaling, load balancing, and managing deployments.

## Contributing
Contributions are welcome! If you'd like to contribute to the project, please follow the guidelines outlined in the Contributing Guidelines.

## License
This project is licensed under the MIT License.