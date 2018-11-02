class UnexpectedNavigation extends Error {
    constructor() {
        super("Unexpected navigation initiated by a script on the loaded page.");
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = UnexpectedNavigation;