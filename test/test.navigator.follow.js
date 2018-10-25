const expect = require("chai").expect;
const e2e = require("./e2e");
const pages = require("./pages");
const navigator = e2e.openWindow();

describe("navigator.follow", function () {

    it("should follow hyperlinks", async function () {
        const linkedPage = await navigator.load(`${pages}/hyperlink.html`);
        expect(linkedPage.URL).to.match(/\/hyperlink\.html$/);
        const links = linkedPage.getElementsByTagName("a");
        const linkToFollow = links[0];
        const emptyPage = await navigator.follow(linkToFollow);
        expect(emptyPage.URL).to.match(/\/empty\.html$/);
    });

    after(function () {
        navigator.closeWindow();
    });
});