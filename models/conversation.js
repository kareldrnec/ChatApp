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
 *                  type: string
 *                  description: The auto-generated id of the conversation
 *              type:
 *                  type: string
 *                  description: What's the type of the conversation? (normal/group)
 *              members:
 *                  type: array
 *                  items: 
 *                      type: string
 *                  minItems: 2
 *                  description: Who is in the conversation? (Array of user IDs)
 *              createdAt:
 *                  type: string
 *                  format: date-time
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