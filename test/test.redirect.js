const expect = require("chai").expect;
const e2e = require("./e2e");
const pages = require("./pages");

describe("e2e", function () {

    let window, navigator;

    before(function () {
        ({window, navigator} = e2e.openWindow());
    });

    it("should recognize client based redirection", async function () {
        await navigator.load(`${pages}/redirect.html`);
        expect(window.location.href).to.match(/\/redirect\.html$/);
        await new Promise(function (resolve) {
            setTimeout(resolve, 250);
        });
        expect(window.location.href).to.match(/\/empty\.html$/);
    });

    after(function () {
        e2e.closeWindow(window);
    });
});