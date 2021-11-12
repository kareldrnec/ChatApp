// routing of posts

var express = require('express');
var router = express.Router();
var auth = require('../auth');
var post_controller = require('../controllers/postController');


router.post("/addNewPost", auth.requiresLogin, post_controller.addNewPost);

module.exports = router;