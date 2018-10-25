const global = require("./global");
const uniqueId = require("./uniqueId");
const UnsupportedEnvironment = require("./UnsupportedEnvironment");
const PublishingConsole = require("./PublishingConsole");
const Navigator = require("./Navigator");
const TaskManager = require("./TaskManager");

class Browser {
    constructor(){
        this.task = new TaskManager();
    }

    openWindow(options) {
        const settings = Object.assign({silent: false, debug: false}, options);
        const localId = uniqueId.createLocalId();
        const globalId = uniqueId.getGlobalId(localId);
        const window = this.tryToOpenBrowserWindow(globalId);
        const console = new PublishingConsole(global.console, localId, settings.silent);
        const navigator = new Navigator(window, console, settings.debug);
        return navigator;
    }

    tryToOpenBrowserWindow(globalId) {
        try {
            return global.open("about:blank", globalId);
        } catch (error) {
            throw new UnsupportedEnvironment("Cannot open new window probably due to strict security settings.")
        }
    }
}

module.exports = Browser;