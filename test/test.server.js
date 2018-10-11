const expect = require("chai").expect;
const e2e = require("./e2e");
const server = require("./server/root");
const navigator = e2e.openWindow({
    debug: true,
    silent: false
});

describe("redirection", function () {

    it("should recognize redirection", async function () {
        const redirectedPage = await navigator.load(`${server}/redirect`);
        expect(redirectedPage.location.href).to.equal(`${server}/`);
    });

    after(function () {
        navigator.closeWindow();
    });
});