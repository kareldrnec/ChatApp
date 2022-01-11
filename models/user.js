/**
 * @swagger
 *  components:
 *      schemas:
 *          User:
 *              type: object
 *              required:
 *                  - _id
 *                  - userName
 *                  - userSurname
 *                  - email
 *                  - password
 *              properties:
 *                  _id:
 *                      type: string
 *                      description: The auto-generated ID of the user
 *                  userName:
 *                      type: string
 *                      description: What is user's name?
 *                  userSurname:
 *                      type: string
 *                      description: What is user's surname?
 *                  email:
 *                      type: string
 *                      format: email
 *                      description: What is user's email?
 *                  password:
 *                      type: string
 *                      format: password
 *                      description: What is user's password?
 *                  personalInfo:
 *                      type: string
 *                      description: What is user's personal information?
 *                  createdAt:
 *                      type: string
 *                      format: date-time
 *                      description: When was the user account created?
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    userSurname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    personalInfo: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('User', userSchema);