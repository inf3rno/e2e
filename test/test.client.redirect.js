const expect = require("chai").expect;
const e2e = require("./e2e");
const task = e2e.task;
const pages = require("./pages");
const navigator = e2e.openWindow();

describe("client side redirection", function () {

    it("should handle scripted redirection", async function () {
        const redirectedPage = await navigator.load(`${pages}/redirect.html`);
        expect(redirectedPage.URL).to.match(/\/redirect\.html$/);
        const emptyPage = await navigator.redirected();
        expect(emptyPage.URL).to.match(/\/empty\.html$/);
    });

    it("should throw error by unexpected scripted redirection", async function () {
        const redirectedPage = await navigator.load(`${pages}/redirect.html`);
        let called = false;

        function logger() {
            called = true;
        }

        window.addEventListener("unhandledrejection", logger);
        await task.defer(200);
        window.removeEventListener("unhandledrejection", logger);
        expect(called).to.equal(true);
    });

    after(function () {
        navigator.closeWindow();
    });
});