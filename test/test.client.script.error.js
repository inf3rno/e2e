const expect = require("chai").expect;
const e2e = require("./e2e");
const task = e2e.task;
const pages = require("./pages");
const navigator = e2e.openWindow({
    silent: true
});

describe("client side script errors", function () {

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

    it("should capture script errors", async function () {
        const messages = [];
        navigator.on("page:error", function (error) {
            messages.push(error.message);
        });
        const scriptedPageWithErrors = await navigator.load(`${pages}/scriptedWithErrors.html`);
        expect(messages.length).to.equal(2);
        expect(messages[0]).to.match(/not.+defined/i);
        expect(messages[1]).to.match(/error.+thrown/i);
        await task.macro();
        expect(messages.length).to.equal(3);
        expect(messages[2]).to.match(/promise.+rejected/i);
    });

    after(function () {
        navigator.closeWindow();
    });
});