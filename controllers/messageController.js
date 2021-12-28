// schema of message

const MessageModel = require('../models/message')
var app = require('../app');

exports.sendMessage = async(msg, senderName, senderID, conversationID) => {
    app.io.emit('chat message', msg, senderName, senderID, conversationID);
    let message = new MessageModel({
        text: msg,
        conversationID: conversationID,
        senderID: senderID
    });
    await message.save();
}

exports.typing = function(room, name, key) {
    app.io.in(room).emit("display typing", name, key);
}

