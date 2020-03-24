var mongoose = require("mongoose");
var Forum = require("./models/forum");
var Comment = require("./models/comment");


//array below will be used to repopulate the database everytime the server restarts
var data = [  
{
    name: "Gaming",
    image: "https://mk0vojovoweumgjb625j.kinstacdn.com/wp-content/uploads/2019/06/25.6.19_header.jpg",
    description: "this forum is all about gaming!"
},

{
    name: "Maths",
    image: "https://scx1.b-cdn.net/csz/news/800/2015/anewwayoftea.jpg",
    description: "this forum is all about maths!"
},
{
    name: "Science",
    image: "https://www.st-johns-coppull.lancs.sch.uk/images/news/science.png",
    description: "this forum is all about science!"
}
]

//this is used to delete and repopulate the database with forums and comments to test out commenting, be careful because ...
//as the forums are being repopulated, although they look the same they have different id's, if error, comment out seedDB() in app.js
//or go back to forums index page, before going to any of the individual show pages

function seedDB(){
    //Remove all forums from collections
    Forum.remove({}, function(err){
         if(err){
             console.log(err);
         }
         console.log("removed forums!");

         //Remove all comments
         Comment.remove({}, function(err) {
             if(err){
                 console.log(err);
             }
             console.log("removed comments!");


              //add a few forums from the array above
             data.forEach(function(seed){
                 Forum.create(seed, function(err, forum){
                     if(err){
                         console.log(err)
                     } else {
                         console.log("added a forum");


                         //create a comment
                         Comment.create(
                             {
                                 text: "generic social media comment",
                                 author: "Homer Simpson"
                             }, function(err, comment){
                                 if(err){
                                     console.log(err);
                                 } else {
                                     forum.comments.push(comment);
                                     forum.save();
                                     console.log("Created new comment");
                                 }
                             });
                     }
                 });
             });
         });
     }); 
     //add a few comments
 }
  
 module.exports = seedDB;