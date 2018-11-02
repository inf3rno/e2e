const WindowClosed = require("./error/WindowClosed");
const UnsupportedEnvironment = require("./error/UnsupportedEnvironment");
const WrongAddress = require("./error/WrongAddress");
const UnexpectedNavigation = require("./error/UnexpectedNavigation");
const createExposedPromise = require("@inf3rno/promise.exposed/noConflict");
const TaskManager = require("./TaskManager");

const events = {
    navigation: {
        started: "navigation:started",
        request: "navigation:request",
        response: "navigation:response",
        error: "navigation:error",
        closed: "navigation:closed"
    },
    page: {
        loading: "page:loading",
        interactive: "page:interactive",
        complete: "page:complete",
        unload: "page:unload",
        error: "page:error"
    }
};

class Navigator {
    constructor(window, console, debug) {
        this.events = events;
        this.window = window;
        this.console = console;
        this.debug = debug;
        this.listeners = {};
        this.unexpectedNavigation = true;
        this.currentNavigation = null;
        this.followingNavigation = createExposedPromise();
        this.window.addEventListener("unload", this.leaving.bind(this));
    }

    load(address) {
        if (this.window.document.readyState !== "complete")
            this.window.stop();
        this.window.location.href = address;
        return this.started("load", address);
    }

    follow(hyperlink) {
        if (!(hyperlink instanceof this.window.HTMLAnchorElement))
            throw new Error("Invalid argument, hyperlink required from the actual page.");
        hyperlink.click();
        return this.started("follow", hyperlink.href);
    }

    submit(form) {
        if (!(form instanceof this.window.HTMLFormElement))
            throw new Error("Invalid argument, form required from the actual page.");
        form.submit();
        return this.started("submit", form.action);
    }

    redirected() {
        return this.started("redirected");
    }

    started(type, address) {
        if (this.window.closed)
            throw new WindowClosed();
        this.unexpectedNavigation = false;
        this.trigger(this.events.navigation.started, type, address);
        return this.followingNavigation;
    }

    closeWindow() {
        this.window.close();
    }

    on(type, listener) {
        if (!this.listeners.hasOwnProperty(type))
            this.listeners[type] = [];
        const typeSpecificListeners = this.listeners[type];
        typeSpecificListeners.push(listener);
    }

    off(type, listener) {
        if (!this.listeners.hasOwnProperty(type))
            return;
        const typeSpecificListeners = this.listeners[type];
        for (let index = typeSpecificListeners.length - 1; index >= 0; index--)
            if (typeSpecificListeners[index] === listener)
                typeSpecificListeners.splice(index, 1);
    }

    trigger(type, ...args) {
        if (this.debug)
            this.console.info(...arguments);
        if (!this.listeners.hasOwnProperty(type))
            return;
        const typeSpecificListeners = this.listeners[type];
        for (let index = 0; index < typeSpecificListeners.length; ++index) {
            const listener = typeSpecificListeners[index];
            listener.apply(null, args);
        }
    }

    async leaving() {
        if (this.window.closed)
            return this.trigger(this.events.navigation.closed);

        await TaskManager.micro();
        this.currentNavigation = this.followingNavigation;
        this.followingNavigation = createExposedPromise();
        if (this.window.document.readyState !== "complete")
            return this.navigationError(new UnsupportedEnvironment("The ready state of the window must not change by next tick after unload."));
        this.trigger(this.events.page.unload);

        await TaskManager.micro();
        this.trigger(this.events.navigation.request);
        if (this.unexpectedNavigation)
            return this.navigationError(new UnexpectedNavigation());
        this.unexpectedNavigation = true;

        await TaskManager.macro();
        if (this.window.document.readyState !== "loading")
            return this.navigationError(new UnsupportedEnvironment(`The ready state of the window must be "loading" instead of "${this.window.document.readyState}" 10-20 msecs after unload.`));
        this.trigger(this.events.navigation.response, this.window.document.URL);

        await TaskManager.micro();
        this.window.console = this.console;
        this.window.addEventListener("unload", this.leaving.bind(this));
        if (this.window.document.location.protocol.indexOf("error") !== -1)
            return this.navigationError(new WrongAddress());
        this.window.addEventListener("error", (event) => {
            this.trigger(this.events.page.error, event.error);
        });
        this.window.addEventListener("unhandledrejection", (event) => {
            this.trigger(this.events.page.error, event.reason);
        });
        this.window.document.addEventListener("readystatechange", () => {
            const readyState = this.window.document.readyState;
            if (readyState === "interactive")
                this.currentNavigation.resolve(this.window.document);
            this.trigger(this.events.page[readyState]);
        });
        this.trigger(this.events.page.loading);
    }

    navigationError(error) {
        this.window.stop();
        this.trigger(this.events.navigation.error, error);
        this.currentNavigation.reject(error);
    }

    event(type) {
        const promise = createExposedPromise();
        const listener = (...args) => {
            this.off(type, listener);
            promise.resolve(args);
        };
        this.on(type, listener);
        return promise;
    }

}


module.exports = Navigator;