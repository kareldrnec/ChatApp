// post controller
const PostModel = require('../models/post');
var app = require('../app');

exports.addNewPost = async (post, userID, username) => {
    try {
        // TODO dodelat zobrazeni o mozne chybe + dodelat take do messages
        //throw new Error()
        let postDB = new PostModel({
            userID: userID,
            postContent: post
        })
        await postDB.save();
        app.io.emit('new post', post, userID, username);
    } catch (err) {
        // error has occurred
        app.io.emit('error occurred', userID);
    }
};

exports.editSelectedPost = async (req, res, next) => {
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

exports.deleteSelectedPost = async (req, res, next) => {
    try {
        await PostModel.findByIdAndDelete(req.params.id);
        req.session.flash = { type: 'success', text: req.__("deleted post") };
        res.redirect('/');
    } catch (err) {
        return next(err);
    }
};
