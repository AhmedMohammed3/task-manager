const ResponseErrorHandler = require("./ResponseErrorHandler");

class UserError extends ResponseErrorHandler {
    constructor(message, statusCode = 400) {
        super(message, statusCode);
    }
}

module.exports = UserError;