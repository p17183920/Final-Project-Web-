var Forum = require("../models/forum");
var Comment = require("../models/comment");

//All the middleware goes here
var middlewareObj = {};

middlewareObj.checkForumOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Forum.findById(req.params.id, function (err, foundForum) {  //used to get the specific forum id variable for the edit.ejs page
            if (err) {
                req.flash("error", "Forum not found!");
                res.redirect("back");
            } else {
                //does user own the forum post?
                if (foundForum.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) { //is any user logged in
        Comment.findById(req.params.comment_id, function (err, foundComment) {  //used to get the specific forum id variable for the edit.ejs page
            if (err) {
                res.redirect("back");
            } else {
                //does user own the comment post?
                if (foundComment.author.id.equals(req.user._id)) { //cant do === because its a mongoose id, so we gotta use .equals
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back"); //if not logged in then redirect them back
    }
};


middlewareObj.isLoggedIn = function (req, res, next) {  //this is acting as a middleware to check is users are logged in
    if (req.isAuthenticated()) { //if the user is logged in, return the next (continue as usual)
        return next();
    }
    req.flash("error", "You need to be logged in to do that!"); // if user is not authenticated do this: wont be displayed until the next page is rendered
    res.redirect("/login");  //if the user is not logged in, redirect to login
};




module.exports = middlewareObj;