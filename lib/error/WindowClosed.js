class WindowClosed extends Error {
    constructor() {
        super("It is not possible to work on a closed window.");
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = WindowClosed;