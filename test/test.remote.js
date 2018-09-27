const expect = require("chai").expect;
const e2e = require("./e2e");
const navigator = e2e.openWindow({
    silent: true
});

describe("cross-origin, cross-frame communication", function () {

    it("should load google.com", async function () {
        const searchPage = await navigator.load("https://www.google.com");
        const searchInput = searchPage.querySelector("input[type=text]");
        expect(searchInput != null).to.equal(true);
        searchInput.value = "rembrandt van rijn";
        const searchForm = searchInput.closest("form");
        searchForm.submit();
        const resultsPage = await navigator.loaded();
        expect(resultsPage.documentElement.innerHTML.indexOf("Rembrandt - Wikipedia") !== -1).to.equal(true);
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
        navigator.closeWindow();
    });
});