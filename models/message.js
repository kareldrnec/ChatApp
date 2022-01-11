/**
 * @swagger
 *  components:
 *      schemas:
 *          Message:
 *              type: object
 *              required:
 *                  - text
 *                  - conversationID
 *                  - senderID
 *              properties:
 *                  _id:
 *                      type: object
 *                      description: The auto-generated ID of the message
 *                  text:
 *                      type: string
 *                      description: What's in the message?
 *                  conversationID:
 *                      type: object
 *                      description: To which conversation does the message belong?
 *                  senderID:
 *                      type: object
 *                      description: Who sends the message?
 *                  createdAt:
 *                      type: string
 *                      format: date
 *                      description: When was the message sent?
 */

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