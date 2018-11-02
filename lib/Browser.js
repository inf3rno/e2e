const global = require("./global");
const uniqueId = require("./uniqueId");
const UnsupportedEnvironment = require("./error/UnsupportedEnvironment");
const PublishingConsole = require("./PublishingConsole");
const Navigator = require("./Navigator");

class Browser {

    static openWindow(options) {
        try {
            const settings = Object.assign({silent: false, debug: false}, options);
            const localId = uniqueId.createLocalId();
            const globalId = uniqueId.getGlobalId(localId);
            const window = global.open("about:blank", globalId);
            const console = new PublishingConsole(global.console, localId, settings.silent);
            const navigator = new Navigator(window, console, settings.debug);
            return navigator;
        } catch (error) {
            if (/security/i.test(error.name))
                throw new UnsupportedEnvironment("Cannot open new window probably due to strict security settings.")
            else
                throw error;
        }
    }

}

module.exports = Browser;