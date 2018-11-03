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
    response.send('<form method="post" action="/echo"><input name="text" /></form>');
});

application.post("/echo", urlencoded, function (request, response) {
    response.send(`<p>${filters.inHTMLData(request.body.text)}</p>`);
});

application.listen(4444);