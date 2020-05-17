var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Forum = require("../models/forum");







//AUTHENTICATION ROUTES

//show register form
router.get("/register", function (req, res) {
    res.render("register.ejs");
});


//handle sign up logic
router.post("/register", function (req, res) {
    //var newUser = new User({ username: req.body.username});
    var newUser = new User({  //pass in all user form data
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    User.register(newUser, req.body.password, function (err, user) {  //pass in the password from the form seperately
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
router.get("/logout", function (req, res) {
    req.logout(); //comes from package
    req.flash("success", "Logged you out!");
    res.redirect("/home");
});



//profile page route
router.get("/users/:id", function (req, res) {
    //find user
    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            req.flash("error", "Cannot find user");
            return res.redirect("/");
        }
        Forum.find().where("author.id").equals(foundUser._id).exec(function (err, forums) {
            if (err) {
                req.flash("error", "Something went wrong!");
               return res.redirect("/");
            }
            
            //render their info
            res.render("users/show.ejs", { user: foundUser, forums: forums});
        })

    });
});



//==========================

module.exports = router;