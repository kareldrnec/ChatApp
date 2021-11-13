
const UserModel = require('../models/user');
const PostModel = require('../models/post');

exports.getIndexPage = async(req, res) => {

    let user = await UserModel.findById(req.session.userId);
    let posts = await PostModel.find();

    // console.log(posts);

    res.render('index', {
        title: 'Home',
        username: user.userName,
        posts: JSON.stringify(posts)
    });
};
  