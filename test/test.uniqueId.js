const expect = require("chai").expect;
const uniqueId = require("./uniqueId");

describe("uniqueId", function () {
    it("should generate unique local and global ids", function () {
        const localIdMap = {};
        const globalIdMap = {};
        const sufficientSampleSize = 1000;
        let duplicationFound = false;
        for (let index = 0; index < sufficientSampleSize; ++index) {
            let localId = uniqueId.createLocalId();
            let globalId = uniqueId.getGlobalId(localId);
            if (localIdMap.hasOwnProperty(localId) || globalIdMap.hasOwnProperty(globalId)) {
                duplicationFound = true;
                break;
            }
            localIdMap[localId] = true;
            globalIdMap[globalId] = true;
        }
        expect(duplicationFound).to.equal(false);
    });

    it("should be able to find ids based on string representations", function () {
        const localId = uniqueId.createLocalId();
        const stringRepresentation = localId.toString();
        expect(uniqueId.find(stringRepresentation)).to.equal(localId);
        expect(function () {
            uniqueId.find("random-string");
        }).to.throw();
    });
});