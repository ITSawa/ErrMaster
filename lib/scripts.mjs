// Object mapping HTTP status codes to their corresponding status messages
const Statuses = {
  100: { status: 100, message: "Continue" },
  101: { status: 101, message: "Switching Protocols" },
  102: { status: 102, message: "Processing" },
  103: { status: 103, message: "Early Hints" },
  200: { status: 200, message: "OK" },
  201: { status: 201, message: "Created" },
  202: { status: 202, message: "Accepted" },
  203: { status: 203, message: "Non-Authoritative Information" },
  204: { status: 204, message: "No Content" },
  205: { status: 205, message: "Reset Content" },
  206: { status: 206, message: "Partial Content" },
  207: { status: 207, message: "Multi-Status" },
  208: { status: 208, message: "Already Reported" },
  226: { status: 226, message: "IM Used" },
  300: { status: 300, message: "Multiple Choices" },
  301: { status: 301, message: "Moved Permanently" },
  302: { status: 302, message: "Found" },
  303: { status: 303, message: "See Other" },
  304: { status: 304, message: "Not Modified" },
  305: { status: 305, message: "Use Proxy" },
  307: { status: 307, message: "Temporary Redirect" },
  308: { status: 308, message: "Permanent Redirect" },
  400: { status: 400, message: "Bad Request" },
  401: { status: 401, message: "Unauthorized" },
  402: { status: 402, message: "Payment Required" },
  403: { status: 403, message: "Forbidden" },
  404: { status: 404, message: "Not Found" },
  405: { status: 405, message: "Method Not Allowed" },
  406: { status: 406, message: "Not Acceptable" },
  407: { status: 407, message: "Proxy Authentication Required" },
  408: { status: 408, message: "Request Timeout" },
  409: { status: 409, message: "Conflict" },
  410: { status: 410, message: "Gone" },
  411: { status: 411, message: "Length Required" },
  412: { status: 412, message: "Precondition Failed" },
  413: { status: 413, message: "Payload Too Large" },
  414: { status: 414, message: "URI Too Long" },
  415: { status: 415, message: "Unsupported Media Type" },
  416: { status: 416, message: "Range Not Satisfiable" },
  417: { status: 417, message: "Expectation Failed" },
  418: { status: 418, message: "I'm a teapot" },
  421: { status: 421, message: "Misdirected Request" },
  422: { status: 422, message: "Unprocessable Entity" },
  423: { status: 423, message: "Locked" },
  424: { status: 424, message: "Failed Dependency" },
  425: { status: 425, message: "Too Early" },
  426: { status: 426, message: "Upgrade Required" },
  428: { status: 428, message: "Precondition Required" },
  429: { status: 429, message: "Too Many Requests" },
  431: { status: 431, message: "Request Header Fields Too Large" },
  451: { status: 451, message: "Unavailable For Legal Reasons" },
  500: { status: 500, message: "Internal Server Error" },
  501: { status: 501, message: "Not Implemented" },
  502: { status: 502, message: "Bad Gateway" },
  503: { status: 503, message: "Service Unavailable" },
  504: { status: 504, message: "Gateway Timeout" },
  505: { status: 505, message: "HTTP Version Not Supported" },
  506: { status: 506, message: "Variant Also Negotiates" },
  507: { status: 507, message: "Insufficient Storage" },
  508: { status: 508, message: "Loop Detected" },
  510: { status: 510, message: "Not Extended" },
  511: { status: 511, message: "Network Authentication Required" },
};

/**
 * Returns a status error object based on the given status code.
 *
 * @param {number} statusCode - The HTTP status code.
 * @returns {Object} - An object containing the status code and message.
 */
function getStatusError(statusCode) {
  return Statuses[statusCode] || { status: 500, message: "Incorrect status" };
}

/**
 * A custom error class used for representing status-specific errors.
 *
 * @class StatusError
 * @extends {Error}
 * @property {number} status - The HTTP status code associated with the error.
 * @property {string|null} details - Additional details about the error (optional).
 *
 * @param {number} [status=500] - The HTTP status code for the error (default is 500).
 * @param {string} [message="Internal Server Error"] - The error message (default is "Internal Server Error").
 * @param {string|null} [details=null] - Additional error details (optional).
 */
class StatusError extends Error {
  constructor(status = 500, message = "Internal Server Error", details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/**
 * Creates a Fastify error handler that formats error responses.
 *
 * @param {Object} [options={ logs: true }] - Configuration options for logging.
 * @param {boolean} options.logs - Whether to log the error (default is true).
 * @returns {Function} - The Fastify error handler function.
 */
const createFastifyErrorHandler = (options = { logs: true }) => {
  return (error, request, reply) => {
    if (options.logs) {
      console.error(error); // Log the error to the console
    }
    const statusCode = error.status || 500;
    const message = error.message || "Internal Server Error";
    const details = error.details || null;

    reply.status(statusCode).send({
      message,
      status: statusCode,
      details,
    });
  };
};

/**
 * Creates an Express error handler that formats error responses.
 *
 * @param {Object} [options={ logs: true }] - Configuration options for logging.
 * @param {boolean} options.logs - Whether to log the error (default is true).
 * @returns {Function} - The Express error handler function.
 */
const createExpressErrorHandler = (options = { logs: true }) => {
  return (err, req, res, next) => {
    if (options.logs) {
      console.error(err); // Log the error to the console
    }
    res.status(err.status || 500).send({
      message: err.message || "Internal Server Error",
      status: err.status || 500,
      details: err.details || null,
    });
  };
};

export {
  Statuses, // Export the status codes and messages
  StatusError, // Export the StatusError class for custom error handling
  getStatusError, // Export the function to retrieve error details by status code
  createExpressErrorHandler, // Export the Express error handler creator
  createFastifyErrorHandler, // Export the Fastify error handler creator
};
