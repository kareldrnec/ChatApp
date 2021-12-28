
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
    console.log("Budu editovat!");
    console.log(req.params.id);
    console.log("-------------");
    req.session.flash = {type: 'success', text: "Selected post was successfully updated"}
    res.redirect('/');
};


exports.deleteSelectedPost = async(req, res) => {
    await PostModel.findByIdAndDelete(req.params.id);
    req.session.flash = { type: 'success', text: req.__("deleted post")};
    res.redirect('/');
};

