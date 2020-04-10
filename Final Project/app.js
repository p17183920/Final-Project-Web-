var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
//requiring routes
var commentRoutes = require("./routes/comments");
var forumRoutes = require("./routes/forums");
var authRoutes = require("./routes/auth");
//var livechatRoutes = require("./routes/livechat");


//=================
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;


  // Routing
app.use(express.static(path.join(__dirname, 'public')));


//===================================

var Forum = require("./models/forum");
var Comment = require("./models/comment");
var seedDB = require("./seeds");




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


//root route // LANDING PAGE
app.get("/", function (req, res) {
   // console.log("landing page triggered");
    res.render("landing.ejs");
})

//profile page route
//need to get userID specific routes probably id/profile
app.get("/profile", function (req, res) {
    res.render("landing.ejs");
})


app.use(authRoutes);   //auth routes in seperate file
app.use("/forums" ,forumRoutes);     //forum routes in seperate file
app.use("/forums/:id/comments", commentRoutes);   //comment routes in seperate file

//live chat routes
app.get("/livechat", function (req, res) {
   // res.sendFile(__dirname + "/public/index.html");
   res.render("livechat.ejs");
});

//app.use(livechatRoutes);

// Live chat stuff

var numUsers = 0;

io.on('connection', (socket) => {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});


server.listen(port, () => {
    console.log('Server listening at port %d', port);
  });

//  app.listen(3000, function () {
//      console.log("server has started")
//  });
