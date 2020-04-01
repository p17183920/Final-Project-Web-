//tips to remember:
//I can include code from another file, using the require() function, which is part of node.js, to load modules

//if the depreciation warning gets out of hand for the collection.remove(), then instead use deleteOne, or deleteMany or db.collection.drop()

//if i want to stop deleting and repopulating the database, then comment out the seedDB function in app.js


//created comments model, used object id to reference comments within forum posts, then create comments....
//then had to populate the actual comments within the forums object using populate and exec, then show on the show page for that forum

//FORUMS LAYOUT

//INDEX - /forums
//NEW - /forums/new
//CREATE - /forums (post request)
//SHOW - /forums/:id


//COMMENTS LAYOUT

//Cant do NEW/CREATE for adding comments on website, because i need to attach it to a forum, rather than just making one randomly like forums
//therefore i need to add the campground id into the URL
//using nested routes
//e.g. forums/:id/comments/new to create new comment within a specific forum show page

//NEW - forums/:id/comments/new             GET
//CREATE - forums/:id/comments              POST

//AUTHENTICATION

//register routes:
//get -forms, passing the username and password to database and post route
//post route- creating new user object, and saving it to database, and then running passport.authenticate() to log them in


//login post route:
//get - form, passing the username and password typed in, to the post route to be handled
//post:
////using middleware to authenticate using local strategy and redirect depending on result, 
//authenticate was given free via passport-local-mongoose
//authenticate checks req.body.username/password and authenticate with what we have stored in the database, already taken care of
//similar to register post route, but instead of creating new user, it just checks and then logs them in with passport.authenticate()



//visual changes:
//thought of a site name, changed colour scheme and added cool thumbnails and image buttons to change site, mainly on landing page


//TO DO LIST:
//live chat/chat rooms
//to do list tool
//weather app
//user authentication WITH encryption-- done
//flash messages, UI improvements
//profile
//update and destroy within forums

//report draft 3rd april
//month left to complete tools
//next meeting 8th april