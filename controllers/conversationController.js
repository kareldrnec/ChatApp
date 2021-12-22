// controller of conversation

const ConversationModel = require('../models/conversation');
const UserModel = require('../models/user');


// show all conversations
exports.showAll = async (req, res) => {
    var users = [];
    var conversations = [];
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

    console.log(conversationsDB)
    conversationsDB.forEach(conversation => conversations.push({
        "conversationID": conversation._id
    }));

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

}

// delete selected conversation
exports.delete = async (req, res) => {


};

// show details of selected conversation
exports.showDetails = async (req, res) => {


}
