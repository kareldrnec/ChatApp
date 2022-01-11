// routing of posts
var express = require('express');
var router = express.Router();
var auth = require('../auth');
var post_controller = require('../controllers/postController');

/**
 * @swagger
 *  tags:
 *      name: Posts
 *      description: API to manage Posts
 * 
 */

/**
 * @swagger
 *  /delete/:id:
 *      delete:
 *          summary: Delete a post
 *          tags: [Posts]
 *          description: Delete a post
 */

router.delete("/delete/:id", auth.requiresLogin, post_controller.deleteSelectedPost);

/**
 * /edit/:id:
 *      post: 
 *          summary: Edit a post
 *          tags: [Posts]
 *          description: Edit a post
 */
router.put("/edit/:id", auth.requiresLogin, post_controller.editSelectedPost);

module.exports = router;