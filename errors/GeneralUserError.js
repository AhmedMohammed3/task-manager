class GeneralUserError extends Error {
    constructor(message, body) {
        super(message);
        this.body = body;
    }
}

module.exports = GeneralUserError;