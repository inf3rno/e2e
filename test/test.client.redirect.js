const expect = require("chai").expect;
const e2e = require("./e2e");
const pages = require("./pages");
const navigator = e2e.openWindow();

describe("client side redirection", function () {

    it("should handle scripted redirection", async function () {
        const redirectAddress = `${pages}/redirect.html`;
        const redirectedPage = await navigator.load(redirectAddress);
        expect(redirectedPage.URL).to.equal(redirectAddress);
        const emptyPage = await navigator.redirected();
        expect(emptyPage.URL).to.equal(`${pages}/empty.html`);
    });

    it("should throw error by unexpected scripted redirection", async function () {
        const redirectedPage = await navigator.load(`${pages}/redirect.html`);
        let navigationError;
        try {
            await navigator.followingNavigation;
        }
        catch (error) {
            navigationError = error;
        }
        expect(navigationError instanceof e2e.error.UnexpectedNavigation).to.equal(true);
    });

    after(function () {
        navigator.closeWindow();
    });
});