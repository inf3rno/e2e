const expect = require("chai").expect;
const e2e = require("./e2e");
const pages = require("./pages");
const navigator = e2e.openWindow();

describe("navigator.load.series", function () {

    it("should load empty page", async function () {
        const emptyPage = await navigator.load(`${pages}/empty.html`);
        expect(emptyPage.location.href).to.match(/\/empty\.html$/);
        const seriesPage = await navigator.load(`${pages}/series.html`);
        expect(seriesPage.location.href).to.match(/\/series\.html$/);
        const emptyPage2 = await navigator.load(`${pages}/empty.html`);
        expect(emptyPage2.location.href).to.match(/\/empty\.html$/);
        const seriesPage2 = await navigator.load(`${pages}/series.html`);
        expect(seriesPage2.location.href).to.match(/\/series\.html$/);
    });

    after(function () {
        navigator.closeWindow();
    });
});