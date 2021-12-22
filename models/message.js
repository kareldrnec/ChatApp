//schema of message

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    text: {
        type: String
    },
    conversationID: {
        type: String
    },
    senderID: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Message", messageSchema);