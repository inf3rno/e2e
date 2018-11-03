const expect = require("chai").expect;
const e2e = require("./e2e");
const server = require("./server/root");
const navigator = e2e.openWindow();

describe("navigator.submit", function () {

    it("should be able to send a form", async function (){
        const formPage = await navigator.load(`${server}/echo`);
        const textInput = formPage.querySelector("input[name='text']");
        const text = `Some text with a random number: ${Math.random()}.`;
        textInput.value = text;
        const form = textInput.closest("form");

        const resultsPage = await navigator.submit(form);
        const resultParagraph = resultsPage.querySelector("p");
        expect(resultParagraph.innerText).to.equal(text);
    });

    after(function () {
        navigator.closeWindow();
    });
});