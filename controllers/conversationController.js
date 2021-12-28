// controller of conversation

const ConversationModel = require('../models/conversation');
const UserModel = require('../models/user');
const MessageModel = require('../models/message');


// show all conversations
exports.showAll = async (req, res) => {
    var users = [],
        conversations = [],
        membersArr = [];
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
        conversations.push({
            "conversationID": conversationsDB[i]._id,
            "conversationType": conversationsDB[i].type,
            "conversationMembers": membersArr,
            "createdAt": date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes()
        })
        membersArr = [];
    }
    res.render("conversations", {
        title: req.__("chats"),
        users: users,
        username: currentUser.userName + " " + currentUser.userSurname,
        conversations: conversations
    });
}

// create a new conversation
exports.create = async (req, res) => {
    // dodelat
    let user = await UserModel.findById(req.session.userId);

    let conversationDB = await ConversationModel.findOne({
        members: { $all: [(req.session.userId).toString(), req.body.userSelect] }
    })

    if (!conversationDB) {
        var membersArr = [];
        membersArr.push((user._id).toString());
        membersArr.push(req.body.userSelect);
        let conversation = new ConversationModel({
            type: "normal",
            members: membersArr
        })
        await conversation.save();
    } else { 
        return res.redirect("/conversations/" + conversationDB._id)
    }
    return res.redirect('/conversations');
};

exports.select = async (req, res) => {
    var messages = [];
    let sender = await UserModel.findById(req.session.userId)
    let messagesDB = await MessageModel.find({
        conversationID: req.params.id
    })

    for (var i = 0; i < messagesDB.length; i++) {
        let messageSender = await UserModel.findById(messagesDB[i].senderID);
        let date = messagesDB[i].createdAt;
        messages.push({
            "senderID": (messageSender._id).toString(),
            "sender": messageSender.userName,
            "text": messagesDB[i].text,
            "userID": (req.session.userId).toString(),
            "createdAt": date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes()
        })
    }

    res.render("chat", {
        title: req.__("conversation"),
        //senderID: (sender._id).toString(),
        senderName: sender.userName,
        currentUser: (req.session.userId).toString(),
        username: sender.userName + " " + sender.userSurname,
        conversationID: req.params.id,
        messages: messages
    })
}

// delete selected conversation
exports.delete = async (req, res) => {
    // dodelat
    console.log("Chci smazat")
    console.log(req.params.id);
    console.log("---------")
    // mazu zpravy
    await MessageModel.deleteMany({
        conversationID: req.params.id
    })
    // mazu konverzaci
    await ConversationModel.findByIdAndDelete(req.params.id)

    req.session.flash = { type: 'success', text: req.__('conversation deleted') }
    return res.redirect("/conversations")

};