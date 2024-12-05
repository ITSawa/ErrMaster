// Interface to define the structure for HTTP status codes and their messages
interface Status {
  status: number; // The HTTP status code (e.g., 200, 404, etc.)
  message: string; // The message corresponding to the status code
}

// A dictionary of HTTP status codes and their messages
const Statuses: Record<number, Status> = {
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

// Function that returns a status object for a given status code.
// If the status code is not found, it returns a default status 500 with the message "Incorrect status".
function getStatusError(statusCode: number): Status {
  return Statuses[statusCode] || { status: 500, message: "Incorrect status" };
}

// Custom error class to handle status-based errors, extending the built-in Error class
class StatusError extends Error {
  status: number; // HTTP status code for the error
  details: any | null; // Optional additional details about the error

  // Constructor to initialize the error with status, message, and optional details
  constructor(
    status: number = 500,
    message: string = "Internal Server Error",
    details: any = null
  ) {
    super(message); // Calls the base class constructor to set the error message
    this.status = status; // Sets the HTTP status code
    this.details = details; // Sets any additional details about the error
  }
}

// Fastify-specific error handler creator
// It returns a function to handle errors in a Fastify application, with optional logging.
const createFastifyErrorHandler = (
  options: { logs?: boolean } = { logs: true }
) => {
  return (error: StatusError, request: any, reply: any) => {
    // Log the error if the 'logs' option is enabled
    if (options.logs) {
      console.error(error);
    }
    const statusCode = error.status || 500; // Get the status code, defaulting to 500
    const message = error.message || "Internal Server Error"; // Get the error message, defaulting to a generic one
    const details = error.details || null; // Get any additional error details

    // Send the response with the error details
    reply.status(statusCode).send({
      message,
      status: statusCode,
      details,
    });
  };
};

// Express-specific error handler creator
// It returns a function to handle errors in an Express application, with optional logging.
const createExpressErrorHandler = (
  options: { logs?: boolean } = { logs: true }
) => {
  return (err: StatusError, req: any, res: any, next: any) => {
    // Log the error if the 'logs' option is enabled
    if (options.logs) {
      console.error(err);
    }
    // Send the response with the error details
    res.status(err.status || 500).send({
      message: err.message || "Internal Server Error",
      status: err.status || 500,
      details: err.details || null,
    });
  };
};

export {
  Statuses,
  StatusError,
  getStatusError,
  createExpressErrorHandler,
  createFastifyErrorHandler,
};
