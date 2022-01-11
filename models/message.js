/**
 * @swagger
 *  components:
 *      schemas:
 *          Message:
 *              type: object
 *              required:
 *                  - _id
 *                  - text
 *                  - conversationID
 *                  - senderID
 *              properties:
 *                  _id:
 *                      type: string
 *                      description: The auto-generated ID of the message
 *                  text:
 *                      type: string
 *                      description: What's in the message?
 *                  conversationID:
 *                      type: string
 *                      description: To which conversation does the message belong?
 *                  senderID:
 *                      type: string
 *                      description: Who sends the message?
 *                  createdAt:
 *                      type: string
 *                      format: date-time
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