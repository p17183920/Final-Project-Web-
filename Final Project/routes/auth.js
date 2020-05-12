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
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to Student.IO " + user.username);
            res.redirect("/home");
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
req.flash("success", "Logged you out!");
res.redirect("/home");
});


//==========================

module.exports = router;