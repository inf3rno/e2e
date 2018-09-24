class LoadingAborted extends Error {
    constructor() {
        super("The loading of the page was aborted probably by a script the page contains.");
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = LoadingAborted;