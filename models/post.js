// schema of post

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    userID: {
        type: String,
        required: true
    },
    postContent: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Post', postSchema);