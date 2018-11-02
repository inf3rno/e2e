window.addEventListener("unhandledrejection", function (event) {
    throw event.reason;
});