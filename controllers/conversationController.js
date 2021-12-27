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
        username: currentUser.userName + " " + currentUser.userSurname,
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
    
  //  console.log(messages)
    req.session.flash = { type: 'success', text: 'Conversation was successfully deleted!'}
    return res.redirect("/conversations")

};