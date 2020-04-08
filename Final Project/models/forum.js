var mongoose = require("mongoose");

//Schema set-up
var forumSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
       id:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
       },
       username: String
    },
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
     ]
});
//creating a model using the forum schema
module.exports = mongoose.model("Forum", forumSchema);


 