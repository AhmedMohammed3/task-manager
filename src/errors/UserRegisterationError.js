const GeneralUserError = require("./GeneralUserError");

class UserRegisterationError extends GeneralUserError {
    constructor(message, body) {
        super(message, body);
    }
}

module.exports = UserRegisterationError;