// controller of conversation

const ConversationModel = require('../models/conversation');
const UserModel = require('../models/user');


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
    for(var i = 0; i < conversationsDB.length; i++){
        var members = conversationsDB[i].members;
        for(var j = 0; j < members.length; j++) {
            if(members[j].userID != (req.session.userId).toString()){
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

    // smazat 
    console.log(conversations)
    console.log(conversations[0].conversationMembers)

    res.render("conversations", {
        title: req.__("chats"),
        users: users,
        conversations: conversations
    });
}

// create a new conversation
exports.create = async (req, res) => {
    // dodelat
    var membersArr = [];
    membersArr.push({
        "userID": (req.session.userId).toString()
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
    res.render("chat", {
        title: req.params.id
    })
}

// delete selected conversation
exports.delete = async (req, res) => {


};

// show details of selected conversation
exports.showDetails = async (req, res) => {


}
