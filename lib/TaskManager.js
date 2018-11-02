class TaskManager {
    static defer(duration) {
        return new Promise((resolve) => setTimeout(resolve, duration));
    }

    static micro() {
        return Promise.resolve();
    }

    static macro() {
        return new Promise((resolve) => requestIdleCallback(resolve, {timeout: 1}));
    }

    static idle() {
        return new Promise((resolve) => requestIdleCallback(resolve));
    }

}

module.exports = TaskManager;