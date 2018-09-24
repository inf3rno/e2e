module.exports = function (config) {

    var options = {
        plugins: [
            "karma-browserify",
            "karma-chrome-launcher",
            "karma-mocha"
        ],
        frameworks: ["browserify", "mocha"],
        files: [
            "index.js",
            "lib/**/*.js",
            "test/*.js",
            {pattern: "test/pages/**/*", included: false}
        ],
        preprocessors: {
            "index.js": ["browserify"],
            "lib/**/*.js": ["browserify"],
            "test/*.js": ["browserify"]
        },
        client: {
            mocha: {
                reporter: "html",
                ui: "bdd",
                timeout: 9500
            }
        },
        browserify: {
            debug: true
        },
        browsers: [
            "ch"
        ],
        customLaunchers: {
            "ch": {
                "base": "Chrome",
                "flags": ["--user-data-dir=''", "--disable-web-security"]
            }
        },
        reporters: ["progress"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        captureTimeout: 10000,
        singleRun: true
    };

    if (process.env.TRAVIS)
        options.customLaunchers.ch.flags.push("--no-sandbox");

    config.set(options);
};