const GeneralUserError = require("./GeneralUserError");

class NotFoundError extends GeneralUserError {
    constructor(message) {
        super(message);
    }
}

module.exports = NotFoundError;