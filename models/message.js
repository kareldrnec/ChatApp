//schema of message

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    text: {
        type: String
    },
    conversationID: {
        type: String
    }
});

module.exports = mongoose.model("Message", messageSchema);