const expect = require("chai").expect;
const e2e = require("./e2e");
const pages = require("./pages");
const navigator = e2e.openWindow();

describe("client side redirection", function () {

    it("should recognize scripted redirection", async function () {
        const redirectedPage = await navigator.load(`${pages}/redirect.html`);
        expect(redirectedPage.URL).to.match(/\/redirect\.html$/);
        const emptyPage = await navigator.loaded();
        expect(emptyPage.URL).to.match(/\/empty\.html$/);
    });

    after(function () {
        navigator.closeWindow();
    });
});