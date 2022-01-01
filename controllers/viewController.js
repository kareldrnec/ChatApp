// view controller
const UserModel = require('../models/user');
const PostModel = require('../models/post');

exports.getIndexPage = async (req, res, next) => {
    let posts = [];
    try {
        let currentUser = await UserModel.findById(req.session.userId);
        let postsDB = await PostModel.find();
        for (var i = postsDB.length - 1; i >= 0; i--) {
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
        return res.render('index', {
            title: req.__('home'),
            userID: currentUser._id,
            username: currentUser.userName + " " + currentUser.userSurname,
            posts: posts
        });
    } catch (err) {
        return next(err);
    }
};

exports.getSettings = async (req, res, next) => {
    try {
        let currentUser = await UserModel.findById(req.session.userId);
        return res.render('settings', {
            title: req.__("settings"),
            language_value: req.cookies.locale,
            username: currentUser.userName + " " + currentUser.userSurname
        })
    } catch (err) {
        return next(err);
    }
}

exports.applySettings = function (req, res) {
    try {
        res.cookie("locale", req.body.languages);
        req.session.flash = { type: 'success', text: req.__("language changed")};
        res.redirect("/settings");
    } catch (err) {
        return next(err);
    }
}