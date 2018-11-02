class WrongAddress extends Error {
    constructor() {
        super("No HTTP server responding at the given address.");
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = WrongAddress;