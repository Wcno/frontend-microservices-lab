# Frontend for AWS microservices

This project is a React interface for consuming a microservice-based backend deployed on AWS. The application communicates with an API Gateway endpoint and allows users to create and query records for different entities.

## What the application does

The main component in [src/App.js](src/App.js) defines an interface with three tabs:

- Users
- Courses
- Enrollments

Each tab shows a form for creating a record and a field for querying by ID. The app uses `fetch` to send HTTP requests to the AWS API.

## AWS integration

The application is configured to consume a REST API exposed through Amazon API Gateway:

- Base endpoint: `https://61gdfto283.execute-api.us-west-2.amazonaws.com/dev`

The frontend sends requests to routes such as:

- `POST /usuarios`
- `GET /usuarios/{id}`
- `POST /cursos`
- `GET /cursos/{id}`
- `POST /inscripciones`
- `GET /inscripciones/{id}`

In the backend, each microservice is associated with its own DynamoDB table, which keeps the data isolated by domain.

## Expected architecture

- React frontend: user interface
- Amazon API Gateway: HTTP entry point for operations
- AWS Lambda: request processing
- Amazon DynamoDB: storage for service records

## Frontend features

- Switch between services from the tab bar
- Register data using dynamic forms
- Query records by ID
- Display backend responses with HTTP status and JSON body

## Local execution

Install dependencies:

```bash
npm install
```

Start the application locally:

```bash
npm start
```

The app will be available at `http://localhost:3000`.

## AWS deployment

To use this UI with another AWS environment, update the `API_BASE` constant in [src/App.js](src/App.js) with the URL of your deployed API Gateway.

Common deployment options:

- Amazon S3 + CloudFront for the static frontend
- AWS Amplify for continuous deployment
- API Gateway + Lambda + DynamoDB for the backend

## Notes

The frontend does not handle business logic directly; it only consumes the services exposed by AWS and displays the responses to the user.
