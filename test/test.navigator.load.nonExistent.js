const expect = require("chai").expect;
const e2e = require("./e2e");
const navigator = e2e.openWindow({
    silent: true
});

describe("navigator.load.nonExistent", function () {

    it("should throw navigation error by a non-existent domain", async function () {
        let wasErrorThrown = false;
        const invalidAddress = "http://www.qqqqqqqqqqq.net/";
        try {
            await navigator.load(invalidAddress);
        }
        catch (error) {
            wasErrorThrown = true;
        }
        expect(wasErrorThrown).to.equal(true);
    });

    after(function () {
        navigator.closeWindow();
    });
});