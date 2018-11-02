const expect = require("chai").expect;
const e2e = require("./e2e");
const pages = require("./pages");
const navigator = e2e.openWindow();

describe("navigator.event", function () {

    it("should create promises which resolve by triggering the given event", async function () {
        const emptyAddress = `${pages}/empty.html`;
        navigator.load(emptyAddress);
        await navigator.event(navigator.events.page.unload);
        expect(navigator.window.document.URL).to.not.equal(emptyAddress);
        expect(navigator.window.document.readyState).to.equal("complete");
        await navigator.event(navigator.events.navigation.request);
        expect(navigator.window.document.URL).to.not.equal(emptyAddress);
        expect(navigator.window.document.readyState).to.equal("complete");
        await navigator.event(navigator.events.navigation.response);
        expect(navigator.window.document.URL).to.equal(emptyAddress);
        expect(navigator.window.document.readyState).to.equal("loading");
        await navigator.event(navigator.events.page.loading);
        expect(navigator.window.document.URL).to.equal(emptyAddress);
        expect(navigator.window.document.readyState).to.equal("loading");
        await navigator.event(navigator.events.page.interactive);
        expect(navigator.window.document.URL).to.equal(emptyAddress);
        expect(navigator.window.document.readyState).to.equal("interactive");
        await navigator.event(navigator.events.page.complete);
        expect(navigator.window.document.URL).to.equal(emptyAddress);
        expect(navigator.window.document.readyState).to.equal("complete");
    });

    after(function () {
        navigator.closeWindow();
    });
});