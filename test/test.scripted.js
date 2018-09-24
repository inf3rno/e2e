const expect = require("chai").expect;
const e2e = require("./e2e");
const pages = require("./pages");

describe("e2e", function () {

    let window, navigator, console;

    before(function () {
        ({window, navigator, console} = e2e.openWindow({
            silent: true
        }));
    });

    it("should capture console logs even from the first script in the head", async function () {
        const messages = [];
        const logger = function (message) {
            messages.push(message);
        };
        console.subscribe("log", logger);
        await navigator.load(`${pages}/scripted.html`);
        console.unsubscribe("log", logger);
        expect(messages).to.deep.equal(["external-script.js", "scripted.html"]);
    });

    it("should capture script errors", async function () {
        const messages = [];
        navigator.on("page:error", function (error) {
            messages.push(error.message);
        });
        await navigator.load(`${pages}/scripted-with-errors.html`);
        expect(messages.length).to.equal(2);
        expect(messages[0]).to.match(/not.+defined/i);
        expect(messages[1]).to.match(/error.+thrown/i);
        await new Promise(function (resolve) {
            setTimeout(resolve, 10);
        });
        expect(messages.length).to.equal(3);
        expect(messages[2]).to.match(/promise.+rejected/i);
    });

    after(function () {
        e2e.closeWindow(window);
    });
});