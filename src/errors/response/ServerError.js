const ResponseErrorHandler = require("./ResponseErrorHandler");

class ServerError extends ResponseErrorHandler {
    constructor(message, statusCode = 500) {
        super(message, statusCode);
    }
}

module.exports = ServerError;