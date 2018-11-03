# e2e

[![Build Status](https://travis-ci.org/inf3rno/e2e.svg?branch=master)](https://travis-ci.org/inf3rno/e2e)

End to end testing with client side javascript.

## example e2e test with the low-level API

End to end testing a simple express.js echo application with Mocha and Chai on Chrome looks like this:

test.js
```js
const expect = require("chai").expect;
const e2e = require("@inf3rno/e2e");
const server = "http://localhost:4444";
const navigator = e2e.openWindow();

describe("testing echo application", function () {

    it("should respond with the same text we send", async function (){
        const formPage = await navigator.load(`${server}/echo`);
        const textInput = formPage.querySelector("input[name='text']");
        const text = `Some text with a random number: ${Math.random()}.`;
        textInput.value = text;
        const form = textInput.closest("form");

        const resultsPage = await navigator.submit(form);
        const resultParagraph = resultsPage.querySelector("p");
        expect(resultParagraph.innerText).to.equal(text);
    });

    after(function () {
        navigator.closeWindow();
    });
});
```

server.js
```js
const express = require("express");
const application = express();
const bodyParser = require("body-parser");
const urlencoded = bodyParser.urlencoded({extended: false});
const filters = require("xss-filters");

application.get("/echo", function (request, response){
    response.send('<form method="post" action="/echo"><input name="text" /></form>');
});

application.post("/echo", urlencoded, function (request, response) {
    response.send(`<p>${filters.inHTMLData(request.body.text)}</p>`);
});

application.listen(4444);
```


## installation with NPM

```sh
npm install @inf3rno/e2e --save-dev
```

## usage with Karma and Chrome

The recommended way to use this library with Karma and a Chrome based custom launcher with disabled web security and isolation:
```js
customLaunchers: {
    "ch": {
        "base": "Chrome",
        "flags": ["--disable-web-security", "--disable-site-isolation-trials"]
    }
},
```

### starting the HTTP server with the tests automatically

If you want to start your server before running the script, you have to use a bash script:
```sh
#!/bin/bash

node test/server/index.js & karma start karma.conf.js
kill $!
```

The starting of the Karma server and the opening of the browser windows usually takes a lot more time than starting a HTTP server.
Otherwise this bash script won't work, and you need to wait for the start of the HTTP server before running the tests.

On Windows environments the `&` operator does not work properly, so you need to use git bash to run the upper script.

In NPM scripts you can try using parallelization libraries, like [concurrently](https://github.com/kimmobrunfeldt/concurrently) or use `bash test.sh`.

In JetBrains IDEs (or probably other IDEs too) you need to set the shell path in `File/Settings/Tool/Terminal` to git bash if you want it to report to the terminal of the IDE.

## usage with Travis

You need to add the following to the Travis YML file:
```yml
dist: trusty
addons:
  chrome: stable
before_install:
  - export DISPLAY=:99.0
  - sh -e /etc/init.d/xvfb start
  - sleep 5
```

Be aware that you need to add the `--no-sandbox` flag in your Karma config if you want to run Chrome in a container.

Another option to use headless Chrome without Xvfb.

## API documentation

You can find the [**API documentation on this wiki page**](https://github.com/inf3rno/e2e/wiki/documentation).

## support of different frameworks and libraries

Currently the project supports NPM + Karma + Chrome. If you need support for any kind of library, then [create an issue](https://github.com/inf3rno/e2e/issues/new), and we will discuss it there.

Supported libraries, frameworks, etc.:
- package manager: NPM
- test launcher and module bundler: Karma and Browserify
- browser: Chrome only (further details about why Chrome only [in the wiki](https://github.com/inf3rno/e2e/wiki/browser-support-and-browser-features))
- testing and assertion library: anything which supports asynchronous testing, e.g. Mocha + Chai

## contribution

Any contribution is welcome, however we have a few rules:
 - every pull request that touches the library code must contain a new test or a test change as well
 - every commit must pass the tests to keep the master green, so you need to squash the commits if you made a mistake
 - using ES6 features, like classes, arrow functions, destructuring is expected
 - keep the code format (WebStorm default), and the same coding style (e.g. double quotes by strings)

Currently we have only a single master branch, so you need to fork the code and
[send the pull request from the fork](https://help.github.com/articles/creating-a-pull-request-from-a-fork/)
if you want to contribute. This can change later if other contributors join.

## license

MIT