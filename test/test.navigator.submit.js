const expect = require("chai").expect;
const e2e = require("./e2e");
const server = require("./server/root");
const navigator = e2e.openWindow({
    silent: true
});

describe("navigator.submit", function () {

    it("should be able to send a form", async function (){
        const someText = `Random number: ${Math.random()}`;
        const formPage = await navigator.load(`${server}/echo`);
        const textInput = formPage.querySelector("input[name='someText']");
        textInput.value = someText;
        const form = textInput.closest("form");
        const resultsPage = await navigator.submit(form);
        expect(resultsPage.URL).to.equal(`${server}/echo/result`);
        const resultParagraph = resultsPage.querySelector("p");
        expect(resultParagraph.innerText).to.equal(someText);
    });

    after(function () {
        navigator.closeWindow();
    });
});