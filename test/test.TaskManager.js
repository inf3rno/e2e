const expect = require("chai").expect;
const TaskManager = require("./TaskManager");

describe("TaskManager", function () {
    it("should resolve in the micro, macro, idle, defer order", async function () {
        const callingOrder = [];
        const micro = TaskManager.micro().then(function () {
            callingOrder.push("micro");
        });
        const macro = TaskManager.macro().then(function () {
            callingOrder.push("macro");
        });
        const idle = TaskManager.idle().then(function () {
            callingOrder.push("idle");
        });
        const defer = TaskManager.defer(100).then(function () {
            callingOrder.push("defer");
        });
        await Promise.all([micro, macro, idle, defer].sort(function (){
            return Math.random() - 0.5;
        }));
        expect(callingOrder).to.deep.equal(["micro", "macro", "idle", "defer"]);
    });

});