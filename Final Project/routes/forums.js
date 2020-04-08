
var express = require("express");
var router = express.Router();
var Forum = require("../models/forum");

//INDEX -- DISPLAY ALL FORUMS
router.get("/", function (req, res) {
    //get all forums from database
    Forum.find({}, function (err, forums) {
        if (err) {
            console.log("error finding forum data from database");
        }
        else {
            res.render("forums/forums.ejs", { forums: forums});
        }
    })
})

//NEW -- DISPLAY FORM TO MAKE NEW FORUM
router.get("/new",isLoggedIn, function (req, res) {
    res.render("forums/newForum.ejs");
});


//CREATE- GET DATA FROM FORM, ADD TO DATABASE, REDIRECT
router.post("/",isLoggedIn, function (req, res) {
    //get data from form and add to forum array
    //redirect to refresh forums
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;  //gotten from name variable in new forums
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newForum = { name: name, image: image, description: desc, author: author };
    //create new campground and save to database
    Forum.create(newForum, function (err, newlyCreatedForum) {
        if (err) { console.log("error creating new forum"); }
        else { 
            res.redirect("/forums");
         }
    });
});


//SHOW -- SHOWS MORE INFO ABOUT ONE FORUM
router.get("/:id", function (req, res) {
    //find the specific forum with the correct ID generated by show forum
    Forum.findById(req.params.id).populate("comments").exec(function (err, foundForum) { //this code populated comments array within each forum instead of an id being there

        if (err) {
            console.log("error finding forum by id");
            console.log(err);
        }
        else {
            //console.log(foundForum);     //uncomment this line to see whats inside of forum with show page for a forum is opened
            //then Render show template with that forum
            res.render("forums/showForum.ejs", { forum: foundForum });
        }
    });
});

function isLoggedIn(req, res, next){  //this is acting as a middleware to check is users are logged in
    if(req.isAuthenticated()){ //if the user is logged in, return the next (continue as usual)
        return next();
    }
    res.redirect("/login");  //if the user is not logged in, redirect to login
    }  
    

module.exports = router;