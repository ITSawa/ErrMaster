# ErrMaster - Centralized Error Handling for RESTful APIs

![ErrMaster](https://img.shields.io/badge/ErrMaster-v1.0-blue)

The **ErrMaster** library is designed for centralized error handling in RESTful APIs. It allows errors to be thrown using the `StatusError` class and then caught by the main route handler, providing a unified, clear response to the client. This approach ensures consistent error responses with the correct HTTP status codes and messages, making it ideal for structured and reliable server responses in RESTful API projects.

### Currently Supported Frameworks:

- **Express**
- **Fastify**

## Features

- **Centralized error handling**: Ensure all errors are handled in a uniform manner throughout the application.
- **Standardized API responses**: Automatically return structured responses for all errors with the correct HTTP status code and message.
- **Customizable error messages**: Provide specific details for each error, making responses informative and clear.
- **Full support for RESTful APIs**: Perfect for projects that require precise and consistent error management.
- **Easy integration**: Compatible with both **Express** and **Fastify** frameworks.

## Installation

To install the library, use npm or yarn:

```bash
npm install errmaster

Usage
1. Basic Usage
First, import ErrMaster into your project:

javascript

const { StatusError, getStatusError, createExpressErrorHandler, createFastifyErrorHandler } = require('errmaster');
2. Throwing Errors
Throw an error anywhere in your application, and ErrMaster will catch it and return a structured response with the appropriate status code and message.

Example of throwing an error:

javascript

throw new StatusError(404, "Not Found", "The resource you are looking for does not exist.");
3. Using with Express
For Express, wrap your routes in try-catch blocks, and pass errors to the next middleware with next(err).

Example:

javascript

const express = require('express');
const { createExpressErrorHandler } = require('errmaster');

const app = express();

// Route with try-catch block
app.get('/', async (req, res, next) => {
  try {
    // Simulating an error
    throw new StatusError(500, "Internal Server Error", "An unexpected error occurred.");
  } catch (err) {
    next(err); // Pass the error to the next handler
  }
});

// Express error handler
app.use(createExpressErrorHandler({ logs: true }));

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
4. Using with Fastify
For Fastify, you can use the same approach with try-catch to handle errors.

Example:

javascript

const fastify = require('fastify')();
const { createFastifyErrorHandler } = require('errmaster');

// Route with try-catch block
fastify.get('/', async (request, reply) => {
  try {
    // Simulating an error
    throw new StatusError(400, "Bad Request", "Invalid parameters provided.");
  } catch (err) {
    reply.send(err); // Send the error response
  }
});

// Fastify error handler
fastify.setErrorHandler(createFastifyErrorHandler({ logs: true }));

fastify.listen(3000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
5. Custom Status Code Handling
If you want to get the details of an error status code without throwing an error, you can use getStatusError.

javascript

const errorDetails = getStatusError(404);
console.log(errorDetails); // { status: 404, message: "Not Found" }
Example Error Response
When an error is thrown, the client will receive a structured response:

json

{
  "status": 404,
  "message": "Not Found",
  "details": "The resource you are looking for does not exist."
}
API
StatusError
A custom error class that extends the built-in Error class.

Constructor Parameters:
status: (optional) HTTP status code (default is 500).
message: (optional) The error message (default is "Internal Server Error").
details: (optional) Additional error details.
getStatusError
A function that retrieves the status message based on the HTTP status code.

Parameters:
statusCode: The HTTP status code (e.g., 404, 500).
Returns: An object containing the status code and message.
createExpressErrorHandler
A function that creates an error handler middleware for Express.

Parameters:
options: (optional) Configuration for logging errors.
logs: Whether to log the error to the console (default is true).
Returns: An error handler function for Express.
createFastifyErrorHandler
A function that creates an error handler for Fastify.

Parameters:
options: (optional) Configuration for logging errors.
logs: Whether to log the error to the console (default is true).
Returns: An error handler function for Fastify.
License
ErrMaster is open-source software licensed under the MIT License.
```
