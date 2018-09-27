const expect = require("chai").expect;
const e2e = require("./e2e");
const pages = require("./pages");
const navigator = e2e.openWindow();

describe("basic navigation", function () {

    it("should load pages", async function () {
        const emptyPage = await navigator.load(`${pages}/empty.html`);
        expect(emptyPage.location.href).to.match(/\/empty\.html$/);
        expect(emptyPage.title).to.match(/empty/i);
    });

    it("should follow links", async function () {
        const linkedPage = await navigator.load(`${pages}/hyperlink.html`);
        expect(linkedPage.location.href).to.match(/\/hyperlink\.html$/);
        const links = linkedPage.getElementsByTagName("a");
        const linkToFollow = links[0];
        linkToFollow.click();
        const emptyPage = await navigator.loaded();
        expect(emptyPage.location.href).to.match(/\/empty\.html$/);
    });

    after(function () {
        navigator.closeWindow();
    });
});