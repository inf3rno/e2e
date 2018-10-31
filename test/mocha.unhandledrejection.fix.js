const nativeAddEventListener = window.addEventListener;
const nativeRemoveEventListener = window.removeEventListener;
const unhandledRejectionType = "unhandledrejection";
const defaultUnhandledRejectionListener = function (event) {
    throw event.reason;
};

const unhandledRejectionListeners = [];
const unhandledRejectionTransmitter = function (...args) {
    if (unhandledRejectionListeners.length)
        unhandledRejectionListeners.forEach((listener) => {
            listener.apply(this, args);
        });
    else
        defaultUnhandledRejectionListener.apply(this, args);
};

window.addEventListener(unhandledRejectionType, unhandledRejectionTransmitter);

window.addEventListener = function (type, listener, ...etc) {
    if (type === unhandledRejectionType)
        unhandledRejectionListeners.push(listener);
    else
        nativeAddEventListener.apply(this, arguments);
};

window.removeEventListener = function (type, listener, ...etc) {
    if (type === unhandledRejectionType) {
        for (let index = unhandledRejectionListeners.length - 1; index >= 0; index--)
            if (unhandledRejectionListeners[index] === listener)
                unhandledRejectionListeners.splice(index, 1);
    }
    else
        nativeRemoveEventListener.apply(this, arguments);
};