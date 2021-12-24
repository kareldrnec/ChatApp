// schema of conversation

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var conversationSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    members: {
        type: Array,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Conversation", conversationSchema);