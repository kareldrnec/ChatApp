
const PostModel = require('../models/post');

exports.addNewPost = async(req, res) => {
    
    const postInput = req.body.postInput;
    
    try{
        let post = new PostModel({
            userID: req.session.userId,
            postContent: postInput
        });
        await post.save();
    } catch(err){
        console.log(err.message);
    }
    req.session.flash = { type: 'success', text: 'New post was successfully added!'};
    res.redirect('/');
};

exports.editSelectedPost = async(req, res) => {
    
};


exports.deleteSelectedPost = async(req, res) => {

};
