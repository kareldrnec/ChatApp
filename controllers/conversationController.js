// controller of conversation

const ConversationModel = require('../models/conversation');
const UserModel = require('../models/user');
const MessageModel = require('../models/message');


// show all conversations
exports.showAll = async (req, res) => {
    var users = [],
        conversations = [],
        membersArr = [];
    let usersDB = await UserModel.find({
        _id: { $ne: req.session.userId }
    });

    usersDB.forEach(user => users.push({
        "userID": user._id,
        "username": user.userName,
        "surname": user.userSurname
    }));

    let conversationsDB = await ConversationModel.find({
        members: {
            $elemMatch: {
                "userID": (req.session.userId).toString()
            }
        }
    });
    for (var i = 0; i < conversationsDB.length; i++) {
        var members = conversationsDB[i].members;
        for (var j = 0; j < members.length; j++) {
            if (members[j].userID != (req.session.userId).toString()) {
                membersArr.push(members[j]);
            }
        }
        conversations.push({
            "conversationID": conversationsDB[i]._id,
            "conversationType": conversationsDB[i].type,
            "conversationMembers": membersArr
        })
        membersArr = [];
    }
    res.render("conversations", {
        title: req.__("chats"),
        users: users,
        conversations: conversations
    });
}

// create a new conversation
exports.create = async (req, res) => {
    // dodelat
    let user = await UserModel.findById(req.session.userId);
    var membersArr = [];
    membersArr.push({
        "userID": (user._id).toString(),
        "username": user.userName + " " + user.userSurname
    });
    membersArr.push({
        "userID": req.body.userSelect,
        "username": req.body.username
    });
    let conversation = new ConversationModel({
        type: "normal",
        members: membersArr
    })
    await conversation.save();
    return res.redirect('/conversations');
};

exports.select = async (req, res) => {
    //dodelat cas
    var messages = [];
    let sender = await UserModel.findById(req.session.userId)
    let messagesDB = await MessageModel.find({
        conversationID: req.params.id
    })  
    for (var i = 0; i < messagesDB.length; i++) {
        let messageSender = await UserModel.findById(messagesDB[i].senderID);
        messages.push({
            "sender": messageSender.userName,
            "text": messagesDB[i].text
        })
    }

    console.log(messages)

    res.render("chat", {
        title: req.__("conversation"),
        senderID: (sender._id).toString(),
        senderName: sender.userName,
        conversationID: req.params.id,
        messages: messages
    })
}

// delete selected conversation
exports.delete = async (req, res) => {


};

// show details of selected conversation
exports.showDetails = async (req, res) => {


}
