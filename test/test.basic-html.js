const expect = require("chai").expect;
const e2e = require("./e2e");
const pages = require("./pages");

describe("e2e", function () {

    let window, navigator, interactor;

    before(function () {
        ({window, navigator, interactor} = e2e.openWindow());
    });

    it("should load pages", async function () {
        await navigator.load(`${pages}/empty.html`);
        expect(window.location.href).to.match(/\/empty\.html$/);
        expect(window.document.title).to.match(/empty/i);
    });

    it("should follow links", async function () {
        await navigator.load(`${pages}/hyperlink.html`);
        expect(window.location.href).to.match(/\/hyperlink\.html$/);
        const links = window.document.getElementsByTagName("a");
        const linkToFollow = links[0];
        linkToFollow.click();
        await new Promise(function (resolve) {
            setTimeout(resolve, 250);
        });
        expect(window.location.href).to.match(/\/empty\.html$/);
    });

    after(function () {
        e2e.closeWindow(window);
    });
});