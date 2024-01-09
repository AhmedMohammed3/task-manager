const GeneralUserError = require("./GeneralUserError");

class UnauthorizedError extends GeneralUserError {
    constructor(message) {
        super(message);
    }
}

module.exports = UnauthorizedError;