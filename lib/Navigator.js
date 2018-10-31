const WindowClosed = require("./WindowClosed");
const UnsupportedEnvironment = require("./UnsupportedEnvironment");
const WrongAddress = require("./WrongAddress");
const UnexpectedNavigation = require("./UnexpectedNavigation");
const Timer = require("./Timer");

const uniqueId = require("./uniqueId");

class Navigator {
    constructor(window, console, debug) {
        this.window = window;
        this.console = console;
        this.debug = debug;
        this.listeners = {};
        this.spyUnload();
        this.unexpectedNavigation = true;
    }

    load(resourceIdentifier) {
        if (this.window.closed)
            throw new WindowClosed();
        if (this.window.document.readyState !== "complete")
            this.window.stop();
        this.unexpectedNavigation = false;
        this.window.location.href = resourceIdentifier;
        this.trigger("navigation:started", resourceIdentifier, "load");
        return this.loaded();
    }

    follow(hyperLink) {
        if (!(hyperLink instanceof this.window.HTMLAnchorElement))
            throw new Error("Invalid argument, hyperlink required from the actual page.");
        this.unexpectedNavigation = false;
        hyperLink.click();
        this.trigger("navigation:started", hyperLink.href, "hyperlink");
        return this.loaded();
    }

    submit(form) {
        if (!(form instanceof this.window.HTMLFormElement))
            throw new Error("Invalid argument, form required from the actual page.");
        this.unexpectedNavigation = false;
        form.submit();
        this.trigger("navigation:started", form.action, "form");
        return this.loaded();
    }

    redirected() {
        this.unexpectedNavigation = false;
        this.trigger("navigation:started", undefined, "redirection");
        return this.loaded();
    }

    loaded() {
        if (this.window.closed)
            throw new WindowClosed();
        return new Promise((resolve, reject) => {
            this.once("page:interactive", () => {
                resolve(this.window.document);
            });
            this.once("navigation:error", reject);
        });
    }

    closeWindow() {
        this.window.close();
    }

    once(type, callback) {
        if (!this.listeners.hasOwnProperty(type))
            this.listeners[type] = [];
        const typeSpecificListeners = this.listeners[type];
        typeSpecificListeners.push({callback: callback, once: true});
    }

    on(type, callback) {
        if (!this.listeners.hasOwnProperty(type))
            this.listeners[type] = [];
        const typeSpecificListeners = this.listeners[type];
        typeSpecificListeners.push({callback: callback, once: false});
    }

    trigger(type, ...args) {
        if (this.debug)
            this.console.info(...arguments);
        if (!this.listeners.hasOwnProperty(type))
            return;
        const typeSpecificListeners = this.listeners[type];
        for (let index = 0; index < typeSpecificListeners.length; ++index) {
            const listenerInfo = typeSpecificListeners[index];
            if (!listenerInfo)
                continue;
            const callback = listenerInfo.callback;
            const once = listenerInfo.once;
            if (once)
                delete typeSpecificListeners[index];
            callback.apply(null, args);
        }
    }

    spyUnload() {
        const timer = new Timer();
        this.window.addEventListener("unload", () => {
            if (this.window.closed) {
                this.trigger("navigation:closed");
                return;
            }
            Promise.resolve().then(() => {
                if (this.window.document.readyState !== "complete")
                    throw new UnsupportedEnvironment("The ready state of the window must not change by next tick after unload.");
                this.trigger("page:unload");
                timer.fromNow();
                this.trigger("navigation:request");
                if (this.unexpectedNavigation)
                    throw new UnexpectedNavigation();
                this.unexpectedNavigation = true;
            });
            requestIdleCallback(() => {
                if (this.window.document.readyState !== "loading")
                    throw new UnsupportedEnvironment(`The ready state of the window must be "loading" instead of "${this.window.document.readyState}" 10-20 msecs after unload.`);
                this.window.console = this.console;
                this.spyUnload();
                if (this.window.document.location.protocol.indexOf("error") !== -1) {
                    this.window.stop();
                    this.trigger("navigation:error", new WrongAddress());
                    return;
                }
                this.window.addEventListener("error", (event) => {
                    this.trigger("page:error", event.error);
                });
                this.window.addEventListener("unhandledrejection", (event) => {
                    this.trigger("page:error", event.reason);
                });
                this.trigger("navigation:response", this.window.document.URL, timer.elapsedTime());
                this.trigger("page:loading", timer.elapsedTime());
                this.window.document.addEventListener("readystatechange", () => {
                    this.trigger("page:" + this.window.document.readyState, timer.elapsedTime());
                });
            }, {timeout: 1});
        });
    }
}


module.exports = Navigator;