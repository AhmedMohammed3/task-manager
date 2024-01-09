const GeneralUserError = require("./GeneralUserError");

class UserRegisteration extends GeneralUserError {
    constructor(message) {
        super(message);
    }
}

module.exports = UserRegisteration;