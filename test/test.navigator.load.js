const expect = require("chai").expect;
const e2e = require("./e2e");
const pages = require("./pages");
const navigator = e2e.openWindow();

describe("navigator.load", function () {

    it("should load empty page", async function () {
        const emptyAddress = `${pages}/empty.html`;
        const emptyPage = await navigator.load(emptyAddress);
        expect(emptyPage.URL).to.equal(emptyAddress);
        expect(emptyPage.title).to.match(/empty/i);
        expect(emptyPage.readyState).to.equal("interactive");
    });

    it("should load the same page again by calling the load with the same parameters", async function () {
        const emptyAddress = `${pages}/empty.html`;
        const emptyPage = await navigator.load(emptyAddress);
        const emptyPage2 = await navigator.load(emptyAddress);
        expect(emptyPage).to.not.equal(emptyPage2);
    });

    after(function () {
        navigator.closeWindow();
    });
});