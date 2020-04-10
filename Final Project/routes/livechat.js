
var express = require("express");
var router = express.Router();


//live chat routes
router.get("/livechat", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});



module.exports = router;