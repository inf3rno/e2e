const expect = require("chai").expect;
const e2e = require("./e2e");
const pages = require("./pages");
const navigator = e2e.openWindow();

describe("scripted redirection", function () {

    it("should recognize scripted redirection", async function () {
        const redirectedPage = await navigator.load(`${pages}/redirect.html`);
        expect(redirectedPage.location.href).to.match(/\/redirect\.html$/);
        const emptyPage = await navigator.loaded();
        expect(emptyPage.location.href).to.match(/\/empty\.html$/);
    });

    after(function () {
        navigator.closeWindow();
    });
});