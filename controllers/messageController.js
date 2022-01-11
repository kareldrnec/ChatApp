// message controller
const MessageModel = require('../models/message')
var app = require('../app');
var validator = require('validator');

// SEND message
exports.sendMessage = async(msg, senderName, senderID, conversationID) => {
    var msg = validator.escape(msg);
    try {
        let message = new MessageModel({
            text: msg,
            conversationID: conversationID,
            senderID: senderID
        });
        await message.save();
        let date = message.createdAt;
        let stringDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
        app.io.emit('chat message', msg, senderName, senderID, stringDate);
    } catch (err) {
        app.io.emit('error occurred', senderID);
    }
}

// SHOW typing
exports.typing = function(room, senderID, senderName, key) {
    try {
        app.io.in(room).emit("display typing", senderID, senderName, key);
    } catch (err) {
        app.io.emit('error occurred', senderID);
    }
}