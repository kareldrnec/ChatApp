// post controller
const PostModel = require('../models/post');
var app = require('../app');
var mongoSanitize = require('express-mongo-sanitize')

// ADD new post
exports.addNewPost = async(post, userID, username) => {
    mongoSanitize(post)
    try {
        let postDB = new PostModel({
            userID: userID,
            postContent: post
        })
        await postDB.save();
        app.io.emit('new post', post, userID, username);
    } catch (err) {
        app.io.emit('error occurred', userID);
    }
};

// EDIT selected post
exports.editSelectedPost = async(req, res, next) => {
    let update = {
        postContent: req.body.editPostInput
    };
    try {
        await PostModel.findByIdAndUpdate(req.params.id, update);
        req.session.flash = { type: 'success', text: req.__('post updated') };
        res.redirect('/');
    } catch (err) {
        return next(err);
    }
};

// DELETE selected post
exports.deleteSelectedPost = async(req, res, next) => {
    try {
        await PostModel.findByIdAndDelete(req.params.id);
        req.session.flash = { type: 'success', text: req.__("deleted post") };
        res.redirect('/');
    } catch (err) {
        return next(err);
    }
};