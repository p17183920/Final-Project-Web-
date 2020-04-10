var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");







//AUTHENTICATION ROUTES

//show register form
router.get("/register", function (req, res) {
    res.render("register.ejs");
});


//handle sign up logic
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.render("register.ejs")
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/forums");
        });
    });
});

//show login form
router.get("/login", function (req, res) {
    res.render("login.ejs");
});

//handle login logic
router.post("/login", passport.authenticate("local",  //check notes "login post route"
    {
        successRedirect: "/forums",
        failureRedirect: "/login"

    }), function (req, res) {
    });


//logout route
router.get("/logout", function(req, res){
req.logout(); //comes from package
res.redirect("/");
});

function isLoggedIn(req, res, next){  //this is acting as a middleware to check is users are logged in
if(req.isAuthenticated()){ //if the user is logged in, return the next (continue as usual)
    return next();
}
res.redirect("/login");  //if the user is not logged in, redirect to login
}  




//==========================

module.exports = router;