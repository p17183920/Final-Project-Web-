var express = require("express");
var app = express();

// The routes I am going to make:
// "/" = hi there

app.get("/", function(req, res){
    res.send("hi there");
});

// /bye = goodbye
app.get("/bye", function(req, res){
    console.log("someone has made a request");
    res.send("goodbye");
});

// /dog == meow
app.get("/dog", function(req, res){
    res.send("WOOF");
});

// the default, catch all route
app.get("*", function (req, res){
res.send("Sent to the default page");
});

// telling express to listen for requests (start server)
app.listen(3000, function(){
    console.log("server listening on port 3000");
});