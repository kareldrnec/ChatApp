// routing for conversations
const express = require("express");
const router = express.Router();
const auth = require('../auth');
const conversation_controller = require('../controllers/conversationController');


/**
 * @swagger
 *  tags:
 *      name: Conversations
 *      description: API to manage Conversations
 */

/**
 * @swagger  
 *  /:
 *      get:
 *          summary: Get all conversations
 *          tags: [Conversations]
 *          description: Retrieve a list of conversations
 */

router.get("/", auth.requiresLogin, conversation_controller.showAll);

/**
 * @swagger
 *  /delete/:id:
 *      delete:
 *          summary: Delete a conversation
 *          tags: [Conversations]
 *          description: Delete a conversation (including messages)
 */


router.delete("/delete/:id", auth.requiresLogin, conversation_controller.delete);

/**
 * @swagger
 *  /createChat:
 *      post:
 *          summary: Create a new chat
 *          tags: [Conversations]
 *          description: Create a new chat between 2 users
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Conversation'
 */

router.post("/createChat", auth.requiresLogin, conversation_controller.create);

/**
 * @swagger
 *  /createGroupChat:
 *      post:
 *          summary: Create a new group chat
 *          tags: [Conversations]
 *          description: Create a new group chat between 3 and more users
 */

router.post("/createGroupChat", auth.requiresLogin, conversation_controller.createGroup);

/**
 * @swagger
 *  /:id:
 *      get:
 *          summary: Get a specific chat
 *          tags: [Conversations]
 *          description: Get a specific chat between 2 or more users
 */

router.get("/:id", auth.requiresLogin, conversation_controller.select);

module.exports = router;