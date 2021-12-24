//schema of message

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    conversationID: {
        type: String,
        required: true
    },
    senderID: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Message", messageSchema);