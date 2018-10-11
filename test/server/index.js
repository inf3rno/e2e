const express = require("express");
const app = express();

app.get("/", function(req, res){
    res.send("main");
});

app.get("/redirect", function(req, res){
    res.redirect("/");
});


app.listen(4444);