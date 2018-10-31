class UnexpectedNavigation extends Error {
    constructor() {
        super("Navigation initiated by a script on the loaded page.");
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = UnexpectedNavigation;