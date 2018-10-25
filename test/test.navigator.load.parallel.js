const expect = require("chai").expect;
const e2e = require("./e2e");
const pages = require("./pages");

describe("navigator.load.parallel", function () {

    it("should be able to handle parallel loads in multiple windows", async function () {
        const addresses = [`${pages}/empty.html`, `${pages}/empty.html`, `${pages}/parallel.html`, `${pages}/parallel.html`];
        const navigators = addresses.map(() => e2e.openWindow());
        const windows = navigators.map(navigator => navigator.window);
        const readyStates = () => windows.map(window => window.document.readyState);
        const locations = () => windows.map(window => window.document.location.href);

        expect(readyStates().every(readyState => readyState != "loading")).to.equal(true);
        const promises = navigators.map((navigator, index) => navigator.load(addresses[index]));
        expect(readyStates().every(readyState => readyState != "loading")).to.equal(true);
        expect(locations().every((location, index) => location !== addresses[index])).to.equal(true);

        await Promise.race(promises);
        expect(readyStates().some(readyState => readyState != "loading")).to.equal(true);
        expect(readyStates().some(readyState => readyState == "loading")).to.equal(true);
        expect(locations().some((location, index) => location === addresses[index])).to.equal(true);

        await Promise.all(promises);
        expect(readyStates().every(readyState => readyState != "loading")).to.equal(true);
        expect(locations().every((location, index) => location === addresses[index])).to.equal(true);
    });
});