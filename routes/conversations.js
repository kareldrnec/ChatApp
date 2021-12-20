// routing for conversations

const express = require("express");
const router = express.Router();
const auth = require('../auth');

router.get("/", auth.requiresLogin, function (req, res) {
    res.render("conversations",
        {
            title: req.__("chats")
        }
    )
})

module.exports = router;