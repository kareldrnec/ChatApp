//user controller
const UserModel = require('../models/user');
const PostModel = require('../models/post');
const MessageModel = require('../models/message');
const ConversationModel = require('../models/conversation');
const bcrypt = require('bcryptjs');

exports.registerNewUser = async (req, res, next) => {
    //generating salt
    const salt = await bcrypt.genSalt(10);

    const { userName, userSurname, email, password, confirmPassword } = req.body;

    try {
        if (password !== confirmPassword) {
            return res.status(400).render("error", {
                title: "Error",
                code: "",
                text: "Passwords are not equal!"
            });
        }
        let user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).render("error", {
                title: "Error",
                code: "",
                text: "User already exists!"
            });
        }
        const hashedPsw = await bcrypt.hash(password, salt);
        user = new UserModel({
            userName,
            userSurname,
            email,
            password: hashedPsw
        })
        await user.save();
        req.session.flash = { type: 'success', text: 'Your account was successfully created!' }
        res.redirect("/users/login");
    } catch (err) {
        return next(err);
    }

};

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).render("error", {
                title: "Error",
                code: "",
                text: "User was not found!"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).render("error", {
                title: "Error",
                code: "",
                text: "Wrong password!"
            });
        }
        req.session.userId = user._id;
        req.session.flash = { type: 'success', text: req.__('logged in') + user.userName + '! :)' }
        return res.redirect("/");
    } catch (err) {
        return next(err);
    }
};

// Logout - session destroy
exports.logout = function (req, res, next) {
    if (req.session) {
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        })
    }
};

exports.myProfile = async (req, res, next) => {
    try {
        let user = await UserModel.findById(req.session.userId);
        let date = user.createdAt;
        let stringDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        return res.render('myProfile', {
            title: req.__('my profile'),
            username: user.userName + " " + user.userSurname,
            email: user.email,
            info: user.personalInfo,
            created: stringDate
        });
    } catch (err) {
        return next(err);
    }
};

exports.editPersonalInfo = async (req, res, next) => {
    let query = { "_id": req.session.userId };
    let personalInfoText = req.body.personalInfoText;
    let update = {
        personalInfo: personalInfoText
    };
    try {
        await UserModel.updateOne(query, update);
        req.session.flash = { type: "success", text: req.__('personal info updated') };
        return res.redirect('/users/myProfile');
    } catch (err) {
        return next(err);
    }
};

exports.showUser = async (req, res, next) => {
    try {
        let user = await UserModel.findById(req.params.id);
        let date = user.createdAt;
        let stringDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        return res.render("user", {
            username: user.userName,
            surname: user.userSurname,
            info: user.personalInfo,
            email: user.email,
            created: stringDate
        });
    } catch (err) {
        return next(err);
    }
}

exports.deleteAccount = async (req, res, next) => {
    //dodelat
    try {
        await PostModel.deleteMany({
            userID: req.session.userId
        })
        var conversations = await ConversationModel.find({
            members: { $in: (req.session.userId).toString() }
        });
        for (var i = 0; i < conversations.length; i++) {
            await MessageModel.deleteMany({
                conversationID: conversations[i]._id
            })
        }
        await ConversationModel.deleteMany({
            members: { $in: (req.session.userId).toString() }
        })
        await UserModel.findByIdAndRemove(req.session.userId);
    } catch (err) {
        return next(err);
    }
    req.session.destroy();
    res.redirect("/users/myProfile");
};
