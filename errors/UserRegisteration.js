const GeneralUserError = require("./GeneralUserError");

class UserRegisteration extends GeneralUserError {
    constructor(message, body) {
        super(message);
        this.body = body;
    }
}

module.exports = UserRegisteration;