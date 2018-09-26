const expect = require("chai").expect;
const e2e = require("./e2e");

describe("cross-origin, cross-frame communication", function () {

    let window, navigator;

    before(function () {
        ({window, navigator} = e2e.openWindow({
            silent: true
        }));
    });

    it("should load google.com", async function () {
        await navigator.load("https://www.google.com");
        const searchForm = window.document.forms["f"];
        expect(!!searchForm).to.equal(true);
        const searchButton = searchForm["btnK"];
        expect(!!searchButton).to.equal(true);
        const searchButtonLegend = searchButton.value;
        expect(searchButtonLegend).to.not.equal("");
    });

    it("should throw navigation error by an unregistered domain", async function () {
        let wasErrorThrown = false;
        try {
            await navigator.load("http://www.qqqqqqqqqqq.net/");
        }
        catch (error) {
            wasErrorThrown = true;
        }
        expect(wasErrorThrown).to.equal(true);
    });

    after(function () {
        e2e.closeWindow(window);
    });
});