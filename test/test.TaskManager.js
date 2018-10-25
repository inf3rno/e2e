const expect = require("chai").expect;
const TaskManager = require("./TaskManager");

describe("TaskManager", function () {
    it("should resolve in the micro, macro, idle, defer order", async function () {
        const callingOrder = [];
        const task = new TaskManager();
        const micro = task.micro().then(function (){
            callingOrder.push("micro");
        });
        const macro = task.macro().then(function (){
            callingOrder.push("macro");
        });
        const idle = task.idle().then(function (){
            callingOrder.push("idle");
        });
        const defer = task.defer(100).then(function (){
            callingOrder.push("defer");
        });
        await Promise.all([micro, macro, idle, defer].sort(function (){
            return Math.random() - 0.5;
        }));
        expect(callingOrder).to.deep.equal(["micro", "macro", "idle", "defer"]);
    });

});