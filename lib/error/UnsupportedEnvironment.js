class UnsupportedEnvironment extends Error {
    constructor(message) {
        super(`This browser is not supported. ${message}`);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = UnsupportedEnvironment;