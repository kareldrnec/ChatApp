// schema of conversation

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var conversationSchema = new Schema({
    type: {
        type: String
    },
    members: {
        type: Array
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Conversation", conversationSchema);