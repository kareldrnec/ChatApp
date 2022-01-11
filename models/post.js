/**
 * @swagger
 *  components:
 *      schemas:
 *          Post:
 *              type: object
 *              required:
 *                  - _id
 *                  - userID
 *                  - postContent
 *              properties:
 *                  _id:
 *                     type: string
 *                     description: The auto-generated ID of the post
 *                  userID:
 *                      type: string
 *                      description: Who wrote the post?
 *                  postContent:
 *                      type: string
 *                      description: What's in the post?
 *                  createdAt:
 *                      type: string
 *                      format: date-time
 *                      description: When was the post created?
 * 
 */

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