process.env.NODE_ENV = 'test';

const chai = require('chai');
//const request = require('supertest')
var chaiHttp = require('chai-http')
const expect = chai.expect;
const db = require('../config/db_test')
const ConversationModel = require('../models/conversation');
const UserModel = require('../models/user');
const conversation_controller = require('../controllers/conversationController');
//const app = require('../app')

chai.use(chaiHttp);


describe('get all conversations', () => {
    it('it should get all conversations', async() => {

    })
})