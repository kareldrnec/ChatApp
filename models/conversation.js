/**
 * @swagger
 *  components:
 *      schemas:
 *       Conversation:
 *          type: object
 *          required:
 *              - _id
 *              - type
 *              - members
 *          properties:
 *              _id:
 *                  type: object
 *                  description: The auto-generated id of the conversation
 *              type:
 *                  type: string
 *                  items:
 *                  description: What's the type of the conversation? (normal/group)
 *              members:
 *                  type: array
 *                  description: Who is in the conversation? (Array of user IDs)
 *              createdAt:
 *                  type: string
 *                  format: date
 *                  description: When was the conversation created?
 *       
 */

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