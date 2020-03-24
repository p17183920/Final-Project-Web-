var express = require("express");
var app = express();;

app.get("/", function (req, res) {
    res.send("Hi there, welcome to my assignment");
})

app.get("/speak/:AnimalName/", function (req, res){
    var animalName = req.params.AnimalName;
res.send("the " + animalName + " has spoken");
})


app.listen(1000, function(){
   console.log("server has started")});

