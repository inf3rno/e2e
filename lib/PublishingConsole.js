class PublishingConsole {
    constructor(console, localId, silent) {
        this.subscribers = {};
        const publishedMethods = {
            info: true,
            log: true,
            warn: true,
            error: true
        };
        const apiMethods = {
            subscribe: this.subscribe.bind(this),
            unsubscribe: this.unsubscribe.bind(this)
        };
        return new Proxy(console, {
            get: (console, method, proxy) => {
                if (apiMethods.hasOwnProperty(method))
                    return apiMethods[method];
                else if (publishedMethods.hasOwnProperty(method))
                    return (...args) => {
                        this.publish(method, ...args);
                        if (!silent)
                            console[method](localId.toString(), ...args);
                    };
                else
                    return Reflect.get(...arguments);
            }
        });
    }

    subscribe(method, subscriber) {
        if (!(subscriber instanceof Function))
            throw new Error("The subscriber must be a Function.");
        if (!this.subscribers.hasOwnProperty(method))
            this.subscribers[method] = [];
        const methodSpecificSubscribers = this.subscribers[method];
        if (methodSpecificSubscribers.indexOf(subscriber) === -1)
            methodSpecificSubscribers.push(subscriber);
    }

    unsubscribe(method, subscriber) {
        if (!(subscriber instanceof Function))
            throw new Error("The subscriber must be a Function.");
        if (!this.subscribers.hasOwnProperty(method))
            return;
        const methodSpecificSubscribers = this.subscribers[method];
        while (true) {
            const index = methodSpecificSubscribers.indexOf(subscriber);
            if (index === -1)
                break;
            methodSpecificSubscribers.splice(index, 1);
        }
    }

    publish(method, ...args) {
        if (!this.subscribers.hasOwnProperty(method))
            return;
        const methodSpecificSubscribers = this.subscribers[method];
        for (let index = 0; index < methodSpecificSubscribers.length; ++index) {
            let subscriber = methodSpecificSubscribers[index];
            subscriber(...args);
        }
    }
}

module.exports = PublishingConsole;