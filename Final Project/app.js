var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");

var Forum = require("./models/forum");
var Comment = require("./models/comment");
var seedDB = require("./seeds");




mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost:27017/appdb", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

seedDB();  //this will remove forums and comments, uncomment this to keep comments/forums in database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "random secret phrase",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//LANDING PAGE
app.get("/", function (req, res) {
    res.render("landing.ejs");
})


app.get("/profile", function (req, res) {
    res.render("landing.ejs");
})

//INDEX -- DISPLAY ALL FORUMS
app.get("/forums", function (req, res) {
    //get all forums from database
    Forum.find({}, function (err, forums) {
        if (err) {
            console.log("error finding forum data from database");
        }
        else {
            res.render("forums/forums.ejs", { forums: forums });
        }
    })
})

//NEW -- DISPLAY FORM TO MAKE NEW FORUM
app.get("/forums/new",isLoggedIn, function (req, res) {
    res.render("forums/newForum.ejs");
});


//CREATE- GET DATA FROM FORM, ADD TO DATABASE, REDIRECT
app.post("/forums",isLoggedIn, function (req, res) {
    //get data from form and add to forum array
    //redirect to refresh forums
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;  //gotten from name variable in new forums
    var newForum = { name: name, image: image, description: desc };
    //create new campground and save to database
    Forum.create(newForum, function (err, newlyCreatedForum) {
        if (err) { console.log("error creating new forum"); }
        else { res.redirect("/forums"); }
    });
});


//SHOW -- SHOWS MORE INFO ABOUT ONE FORUM
app.get("/forums/:id", function (req, res) {
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



//==========================
//COMMENTS ROUTES

app.get("/forums/:id/comments/new",isLoggedIn, function (req, res) {
    //find forum by id
    Forum.findById(req.params.id, function (err, forum) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/newComment.ejs", { forum: forum });  //need to also pass in forum, to use as reference to forum in newCommentejs

        }
    })
})

app.post("/forums/:id/comments",isLoggedIn, function (req, res) {
    //lookup forum using ID
    Forum.findById(req.params.id, function (err, forum) {

        if (err) {
            console.log(err);
            res.redirect("/forums");  //this will eventually be replaced by an error message
        }
        else {
            //create new comment
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                }
                else {
                    //connect new comment to forum
                    forum.comments.push(comment);
                    forum.save();
                    //redirect back to show route of forum
                    res.redirect("/forums/" + forum._id);  //redirect to specific forum page the comment was made for

                }
            })

        }
    });

})

//==========================




//AUTHENTICATION ROUTES

//show register form
app.get("/register", function (req, res) {
    res.render("register.ejs");
});


//handle sign up logic
app.post("/register", function (req, res) {
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
app.get("/login", function (req, res) {
    res.render("login.ejs");
});

//handle login logic
app.post("/login", passport.authenticate("local",  //check notes "login post route"
    {
        successRedirect: "/forums",
        failureRedirect: "/login"

    }), function (req, res) {
    });


//logout route
app.get("/logout", function(req, res){
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







app.listen(3000, function () {
    console.log("server has started")
});
