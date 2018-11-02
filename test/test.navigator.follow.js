const expect = require("chai").expect;
const e2e = require("./e2e");
const pages = require("./pages");
const navigator = e2e.openWindow();

describe("navigator.follow", function () {

    it("should follow hyperlinks", async function () {
        const hyperlinkAddress = `${pages}/hyperlink.html`;
        const linkedPage = await navigator.load(hyperlinkAddress);
        expect(linkedPage.URL).to.equal(hyperlinkAddress);
        const links = linkedPage.getElementsByTagName("a");
        const linkToFollow = links[0];
        const emptyPage = await navigator.follow(linkToFollow);
        expect(emptyPage.URL).to.equal(`${pages}/empty.html`);
    });

    after(function () {
        navigator.closeWindow();
    });
});