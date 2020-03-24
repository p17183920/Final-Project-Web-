var express = require("express");
var app = express();
var request = require("request");
//app.set("view engine", "ejs");



app.get("/", function(req, res){
    res.render("search.ejs");
})

app.get("/results", function (req, res) {
    var searchItem = req.query.search;
    var URL = "http://omdbapi.com/?s=" + searchItem + "&apikey=thewdb"
    request(URL, function (error, response, body) {
        if(!error && response.statusCode == 200)
        {
            var parsedData = JSON.parse(body);
            res.render("results.ejs", {parsedData: parsedData});
        }
        
    })
})




app.listen(1000, function(){
   console.log("movie app server has started")});
