var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: String,
    firstName: String,
    lastName: String,
    email: String
});

UserSchema.plugin(passportLocalMongoose); //this adds in all the useful methods to our "User"


module.exports = mongoose.model("User", UserSchema); 