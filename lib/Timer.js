class Timer {
    constructor() {
        this.timeOrigin = 0;
    }

    fromNow() {
        this.timeOrigin = new Date().getTime();
    }

    elapsedTime() {
        return new Date().getTime() - this.timeOrigin;
    }
}

module.exports = Timer;