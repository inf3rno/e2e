class TaskManager {
    defer(duration) {
        return new Promise((resolve) => setTimeout(resolve, duration));
    }

    micro() {
        return Promise.resolve();
    }

    macro() {
        return new Promise((resolve) => requestIdleCallback(resolve, {timeout: 1}));
    }

    idle() {
        return new Promise((resolve) => requestIdleCallback(resolve));
    }

}

module.exports = TaskManager;