# Movie App - BE

## Description

### Backend Tech Stack

The Movie App Backend is a robust and efficient platform developed using the Nest.js framework and MySQL database. This application provides functionalities to create, edit, and manage movie information.
The server is deployed on AWS EC2 machine with docker-compose setup running Node 18 and MySQL 8.


## Installation for Developers

### Prerequisites

Make sure to have the following installed in your system before running the application:

* Node.js, NPM
* Docker, Docker-Compose
* Nest.js
* Typescript, ts-node

## Usage

### How to develop

1. From the root folder, run docker-compose to build the images: ` docker-compose up --build`.

2. Run api's on **localhost:80**

## Structure

```bash
├── README.md           # you're here
├── db                  # Database configurations and migrations
├── src                 # Source code directory
│   ├── auth            # Authentication module (signup and signin)
│   ├── movies          # Module for movie routes and application logic
│   ├── s3              # Implementation for generating pre-signed URLs (upload images to S3 bucket)
│   ├── utils           # contains utility functions
│   └── app.module.ts   # Main module containing service logic
│   └── main.ts         # Application entry point
└── test                # unit tests
```

