// controller of conversation
const ConversationModel = require('../models/conversation');
const UserModel = require('../models/user');
const MessageModel = require('../models/message');

// SHOW all conversations
exports.showAll = async(req, res, next) => {
    var users = [],
        conversations = [],
        membersArr = [];
    try {
        let currentUser = await UserModel.findById(req.session.userId);
        let usersDB = await UserModel.find({
            _id: { $ne: req.session.userId }
        });
        usersDB.forEach(user => users.push({
            "userID": user._id,
            "username": user.userName,
            "surname": user.userSurname
        }));
        let conversationsDB = await ConversationModel.find({
            members: (req.session.userId).toString()
        });
        for (var i = 0; i < conversationsDB.length; i++) {
            var members = conversationsDB[i].members;
            for (var j = 0; j < members.length; j++) {
                if (members[j] != (req.session.userId).toString()) {
                    let user = await UserModel.findById(members[j]);
                    membersArr.push({
                        "userID": members[j],
                        "username": user.userName + " " + user.userSurname
                    });
                }
            }
            let date = conversationsDB[i].createdAt;
            //console.log(date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes())
            conversations.push({
                "conversationID": conversationsDB[i]._id,
                "conversationType": conversationsDB[i].type,
                "conversationMembers": membersArr,
                "createdAt": date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes()
            })
            membersArr = [];
        }
        return res.render("conversations", {
            title: req.__("chats"),
            users: users,
            username: currentUser.userName + " " + currentUser.userSurname,
            conversations: conversations
        });
    } catch (err) {
        return next(err);
    }
}

// CREATE a new conversation or redirect to existing one
exports.create = async(req, res, next) => {
    try {
        var user = await UserModel.findById(req.session.userId);
        var conversation = await ConversationModel.findOne({
            members: { $all: [(req.session.userId).toString(), req.body.userSelect] }
        })
        if (!conversation) {
            var membersArr = [];
            membersArr.push((user._id).toString());
            membersArr.push(req.body.userSelect);
            var conversation = new ConversationModel({
                type: "normal",
                members: membersArr
            })
            await conversation.save();
        }
        return res.redirect("/conversations/" + conversation._id);
    } catch (err) {
        return next(err);
    }
};

// CREATE a new group conversation or redirect to existing one
exports.createGroup = async(req, res, next) => {
    try {
        var selection = req.body.groupSelect
        if (selection && Array.isArray(selection)) {
            var user = await UserModel.findById(req.session.userId);
            var membersArr = [];
            membersArr.push((user._id).toString());
            membersArr = membersArr.concat(selection);
            var conversation = await ConversationModel.findOne({
                members: { $all: membersArr }
            });
            if (!conversation) {
                var conversation = new ConversationModel({
                    type: "group",
                    members: membersArr
                });
                await conversation.save();
                req.session.flash = { type: "success", text: req.__("group chat created") };
            } else {
                req.session.flash = { type: "warning", text: req.__("group chat exists") };
            }
            return res.redirect('/conversations/' + conversation._id);
        } else {
            req.session.flash = { type: 'danger', text: req.__("group chat error") };
        }
        return res.redirect('/conversations')
    } catch (err) {
        return next(err);
    }
}

// OPEN selected conversation
exports.select = async(req, res, next) => {
    var messages = [];
    try {
        var sender = await UserModel.findById(req.session.userId);
        var messagesDB = await MessageModel.find({
            conversationID: req.params.id
        })
        for (var i = 0; i < messagesDB.length; i++) {
            var messageSender = await UserModel.findById(messagesDB[i].senderID);
            var date = messagesDB[i].createdAt;
            messages.push({
                "senderID": (messageSender._id).toString(),
                "sender": messageSender.userName,
                "text": messagesDB[i].text,
                "userID": (req.session.userId).toString(),
                "createdAt": date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes()
            })
        }
        return res.render("chat", {
            title: req.__("conversation"),
            senderName: sender.userName,
            currentUser: (req.session.userId).toString(),
            username: sender.userName + " " + sender.userSurname,
            conversationID: req.params.id,
            messages: messages
        });
    } catch (err) {
        return next(err);
    }
}

// DELETE selected conversation + messages in selected conversation
exports.delete = async(req, res, next) => {
    try {
        await MessageModel.deleteMany({
            conversationID: req.params.id
        })
        await ConversationModel.findByIdAndDelete(req.params.id)
        req.session.flash = { type: 'success', text: req.__('conversation deleted') }
    } catch (err) {
        return next(err);
    }
    return res.redirect("/conversations");
};