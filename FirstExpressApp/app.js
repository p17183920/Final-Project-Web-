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

//using route parameters to create pattern
app.get("/post/:AnyPostName", function(req, res){
    var post = req.params.AnyPostName;
    res.send("welcome to a post about " + post);
});

app.get("/forum/:anyForum", function(req, res){
    res.send("welcome to a forum");
});

app.get("/profile/:UserProfile/:UserNumber/:id/", function(req, res){
    var profile = req.params.UserProfile;
    res.send("welcome to " +  profile + "'s Profile");
})

app.get("/speak/:Message/:NumberOfTimes/", function(req, res){
    var message = req.params.Message;
    var NoOfTimes = Number(req.params.NumberOfTimes);
    var result = "";
    for(var i = 0; i<NoOfTimes; i++)
    {
      result += message + " ";
    }
    res.send(result);
})

// the default, catch all route
app.get("*", function (req, res){
    res.send("Sent to the default page");
    });

// telling express to listen for requests (start server)
app.listen(3000, function(){
    console.log("server listening on port 3000");
});