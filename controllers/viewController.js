
const UserModel = require('../models/user');
const PostModel = require('../models/post');

exports.getIndexPage = async(req, res) => {

    let user = await UserModel.findById(req.session.userId);
    let posts = await PostModel.find();
    console.log(posts);
    res.render('index', {
        title: req.__('home'),
        username: user.userName,
        posts: posts
    });
};
  
exports.applySettings = function(req, res) {
    //Dodelat, mozna zmena barvy
    res.cookie("locale", req.body.languages);
    res.redirect("/settings");
}