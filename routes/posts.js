// routing of posts

var express = require('express');
var router = express.Router();
var auth = require('../auth');
var post_controller = require('../controllers/postController');


router.post("/addNewPost", auth.requiresLogin, post_controller.addNewPost);

router.post("/delete/:id", auth.requiresLogin, post_controller.deleteSelectedPost);

router.post("/edit/:id", auth.requiresLogin, post_controller.editSelectedPost);

module.exports = router;