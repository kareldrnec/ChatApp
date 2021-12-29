// schema of message

const MessageModel = require('../models/message')
var app = require('../app');

exports.sendMessage = async(msg, senderName, senderID, conversationID) => {
    let message = new MessageModel({
        text: msg,
        conversationID: conversationID,
        senderID: senderID
    });
    await message.save();
    let date = message.createdAt;
    let stringDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
    app.io.emit('chat message', msg, senderName, senderID, stringDate);
}

exports.typing = function(room, senderId, senderName, key) {
    app.io.in(room).emit("display typing", senderId, senderName, key);
}

