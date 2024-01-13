const GeneralUserError = require("./GeneralUserError");

class NotFoundError extends GeneralUserError {
    constructor(message, body) {
        super(message, body);
    }
}

module.exports = NotFoundError;