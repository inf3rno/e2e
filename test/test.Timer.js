const expect = require("chai").expect;
const Timer = require("./Timer");

const expectSimilarTime = function (value, expectation) {
    const acceptableDelay = 10;
    const inRange = value >= (expectation - acceptableDelay) && value <= (expectation + acceptableDelay);
    expect(inRange).to.equal(true);
};

describe("Timer", function () {
    it("should return the msec timestamp by default", function () {
        const timer = new Timer();
        expectSimilarTime(timer.elapsedTime(), new Date().getTime());
    });

    it("should return the elapsed msecs from the given time origin", function (next) {
        const timer = new Timer();
        timer.fromNow();
        setTimeout(function () {
            expectSimilarTime(timer.elapsedTime(), 50);
            next();
        }, 50);
    });
});