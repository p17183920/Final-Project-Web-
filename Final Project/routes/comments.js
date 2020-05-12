var express = require("express");
var router = express.Router({ mergeParams: true });
var Forum = require("../models/forum");
var Comment = require("../models/comment");
var middleware = require("../middleware"); //index.js is automatically detected because index is special

//==========================
//COMMENTS ROUTES
//========================

// Comments new

router.get("/new", middleware.isLoggedIn, function (req, res) {
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
router.post("/", middleware.isLoggedIn, function (req, res) {
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
                    req.flash("error", "Something went wrong with creating a comment!");
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
                    req.flash("success", "Successfully added a comment!");
                    //redirect back to show route of forum
                    res.redirect("/forums/" + forum._id);  //redirect to specific forum page the comment was made for

                }
            })

        }
    });

});

//EDIT ROUTE FOR COMMENTS
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit.ejs", { forum_id: req.params.id, comment: foundComment }); //providing the edit.ejs with the forum id and comment object
        }
    });
});

//UPDATE ROUTE FOR COMMENTS
router.put("/:comment_id",middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/forums/" + req.params.id);
        }
    });
});

//DELETE ROUTE FOR COMMENTS

router.delete("/:comment_id",middleware.checkCommentOwnership, function (req, res) {
    //find by id and remove
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/forums/" + req.params.id);
        }
    });
});






module.exports = router;