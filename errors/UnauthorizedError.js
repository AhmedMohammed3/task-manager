const GeneralUserError = require("./GeneralUserError");

class UnauthorizedError extends GeneralUserError {
    constructor(message, body) {
        super(message, body);
    }
}

module.exports = UnauthorizedError;