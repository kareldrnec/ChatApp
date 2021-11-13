//FILENAME : db.js

const mongoose = require('mongoose');

//mongoURI
const mongoURI = "mongodb+srv://user1234:user1234@cluster0.gr9ky.mongodb.net/PWA?retryWrites=true&w=majority";

const InitiateMongoServer = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

module.exports = InitiateMongoServer;
