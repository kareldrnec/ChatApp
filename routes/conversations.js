// routing for conversations
const express = require("express");
const router = express.Router();
const auth = require('../auth');
const conversation_controller = require('../controllers/conversationController');

// route - get all conversations
router.get("/", auth.requiresLogin, conversation_controller.showAll);

// route - delete selected conversation
router.get("/delete/:id", auth.requiresLogin, conversation_controller.delete);

// route - create chat
router.post("/createChat", auth.requiresLogin, conversation_controller.create);

// route - get chat
router.get("/:id", auth.requiresLogin, conversation_controller.select);

module.exports = router;