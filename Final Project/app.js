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

//requiring routes
var commentRoutes = require("./routes/comments");
var forumRoutes = require("./routes/forums");
var authRoutes = require("./routes/auth");


mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost:27017/appdb", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

//seedDB();  //this will remove forums and comments, uncomment this to keep comments/forums in database

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

app.use(function(req, res, next){ //middleware to pass req.user to every template
res.locals.currentUser = req.user;
next();  //need the next otherwise everything will stop, need next to say "carry on with the rest"
});






app.use(authRoutes);
app.use("/forums" ,forumRoutes);
app.use("/forums/:id/comments", commentRoutes);



app.listen(3000, function () {
    console.log("server has started")
});
