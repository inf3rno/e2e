const expect = require("chai").expect;
const e2e = require("./e2e");
const pages = require("./pages");
const navigator = e2e.openWindow({
    silent: true
});

describe("client side script logging", function () {

    it("should capture console logs even from the first script in the head", async function () {
        const messages = [];
        const logger = function (message) {
            messages.push(message);
        };
        navigator.console.subscribe("log", logger);
        const scriptedPage = await navigator.load(`${pages}/scripted.html`);
        navigator.console.unsubscribe("log", logger);
        expect(messages).to.deep.equal(["externalScript.js", "scripted.html"]);
    });

    after(function () {
        navigator.closeWindow();
    });
});