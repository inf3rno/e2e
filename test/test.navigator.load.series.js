const expect = require("chai").expect;
const e2e = require("./e2e");
const pages = require("./pages");
const navigator = e2e.openWindow();

describe("navigator.load.series", function () {

    it("should load empty page", async function () {
        const emptyAddress = `${pages}/empty.html`;
        const seriesAddress = `${pages}/series.html`;
        const emptyPage = await navigator.load(emptyAddress);
        expect(emptyPage.URL).to.equal(emptyAddress);
        const seriesPage = await navigator.load(seriesAddress);
        expect(seriesPage.URL).to.equal(seriesAddress);
        const emptyPage2 = await navigator.load(emptyAddress);
        expect(emptyPage2.URL).to.equal(emptyAddress);
        const seriesPage2 = await navigator.load(seriesAddress);
        expect(seriesPage2.URL).to.equal(seriesAddress);
    });

    after(function () {
        navigator.closeWindow();
    });
});