const GeneralUserError = require("./GeneralUserError");

class UserRegisteration extends GeneralUserError {
    constructor(message, body) {
        super(message, body);
    }
}

module.exports = UserRegisteration;