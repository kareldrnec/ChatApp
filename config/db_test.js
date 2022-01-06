const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI_TEST;

module.exports.connect = async() => {
    const mongooseOpts = {
        useNewUrlParser: true
    };
    await mongoose.connect(mongoURI, mongooseOpts);
}

module.exports.clearDatabase = async() => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}

module.exports.closeDatabase = async() => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
}