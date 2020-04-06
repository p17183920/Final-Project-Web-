var express = require("express");
var router = express.Router({mergeParams: true});
var Forum = require("../models/forum");
var Comment = require("../models/comment");


//==========================
//COMMENTS ROUTES
//========================

// Comments new

router.get("/new",isLoggedIn, function (req, res) {
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

//handle comments new form
router.post("/",isLoggedIn, function (req, res) {
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
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
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

function isLoggedIn(req, res, next){  //this is acting as a middleware to check is users are logged in
    if(req.isAuthenticated()){ //if the user is logged in, return the next (continue as usual)
        return next();
    }
    res.redirect("/login");  //if the user is not logged in, redirect to login
    }; 

    

module.exports = router;