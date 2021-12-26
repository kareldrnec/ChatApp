
const UserModel = require('../models/user');
const PostModel = require('../models/post');

exports.getIndexPage = async(req, res) => {

    let currentUser = await UserModel.findById(req.session.userId);
    let postsDB = await PostModel.find();
    let posts = [];


    for(var i = postsDB.length - 1; i >= 0; i--) {
        var user = await UserModel.findById(postsDB[i].userID);
        var date = postsDB[i].createdAt;
        posts.push({
            "_id": postsDB[i]._id,
            "currentUserID": currentUser._id,
            "userID": postsDB[i].userID,
            "username": user.userName,
            "usersurname": user.userSurname,
            "postContent": postsDB[i].postContent,
            "created": date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes()
        })
    }
    res.render('index', {
        title: req.__('home'),
        userID: currentUser._id,
        username: currentUser.userName + " " + currentUser.userSurname,
        posts: posts
    });
};
  
exports.applySettings = function(req, res) {
    //Dodelat, mozna zmena barvy
    res.cookie("locale", req.body.languages);
    res.redirect("/settings");
}