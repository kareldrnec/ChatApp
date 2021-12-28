
const PostModel = require('../models/post');
var app = require('../app');

exports.addNewPost = async(post, userID, username) => {
    app.io.emit('new post', post, userID, username);
    let postDB = new PostModel({
        userID: userID,
        postContent: post
    });
    await postDB.save();
};

exports.editSelectedPost = async(req, res) => {
    let update = {
        postContent: req.body.editPostInput
    };
    await PostModel.findByIdAndUpdate(req.params.id, update);
    req.session.flash = {type: 'success', text: "Selected post was successfully updated"}
    res.redirect('/');
};

exports.deleteSelectedPost = async(req, res) => {
    await PostModel.findByIdAndDelete(req.params.id);
    req.session.flash = { type: 'success', text: req.__("deleted post")};
    res.redirect('/');
};
