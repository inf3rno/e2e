const express = require("express");
const application = express();
const bodyParser = require("body-parser");
const urlencoded = bodyParser.urlencoded({extended: false});
const filters = require("xss-filters");

application.get("/", function(request, response){
    response.send("main");
});

application.get("/redirect", function(request, response){
    response.redirect("/");
});

application.get("/echo", function (request, response){
    response.send('<form method="post" action="/echo/result" enctype="application/x-www-form-urlencoded; charset=utf-8"><input type="text" name="someText" /></form>');
});

application.post("/echo/result", urlencoded, function (request, response) {
    response.send(`<p>${filters.inHTMLData(request.body.someText)}</p>`);
});

application.listen(4444);