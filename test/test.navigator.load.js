const expect = require("chai").expect;
const e2e = require("./e2e");
const pages = require("./pages");
const navigator = e2e.openWindow();

describe("navigator.load", function () {

    it("should load empty page", async function () {
        const emptyPage = await navigator.load(`${pages}/empty.html`);
        expect(emptyPage.URL).to.match(/\/empty\.html$/);
        expect(emptyPage.title).to.match(/empty/i);
        expect(emptyPage.readyState).to.equal("interactive");
    });

    after(function () {
        navigator.closeWindow();
    });
});