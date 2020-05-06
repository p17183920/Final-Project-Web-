var express = require("express");
var router = express.Router({ mergeParams: true });
var Forum = require("../models/forum");
var Comment = require("../models/comment");


//==========================
//COMMENTS ROUTES
//========================

// Comments new

router.get("/new", isLoggedIn, function (req, res) {
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
router.post("/", isLoggedIn, function (req, res) {
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

});

//EDIT ROUTE FOR COMMENTS
router.get("/:comment_id/edit",checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit.ejs", { forum_id: req.params.id, comment: foundComment }); //providing the edit.ejs with the forum id and comment object
        }
    });
});

//UPDATE ROUTE FOR COMMENTS
router.put("/:comment_id",checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/forums/" + req.params.id);
        }
    });
});

//DELETE ROUTE FOR COMMENTS

router.delete("/:comment_id",checkCommentOwnership, function (req, res) {
    //find by id and remove
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/forums/" + req.params.id);
        }
    });
});




//==========================
function isLoggedIn(req, res, next) {  //this is acting as a middleware to check is users are logged in
    if (req.isAuthenticated()) { //if the user is logged in, return the next (continue as usual)
        return next();
    }
    res.redirect("/login");  //if the user is not logged in, redirect to login
};

function checkCommentOwnership(req, res, next) {
    if(req.isAuthenticated()){ //is any user logged in
        Comment.findById(req.params.comment_id, function(err, foundComment){  //used to get the specific forum id variable for the edit.ejs page
            if(err){
                res.redirect("back");
            } else{
                     //does user own the comment post?
                if(foundComment.author.id.equals(req.user._id)){ //cant do === because its a mongoose id, so we gotta use .equals
                    next();
                } else{
                    res.redirect("back");
                }
            }
        });
    } else {
       res.redirect("back"); //if not logged in then redirect them back
    }
}
    


module.exports = router;