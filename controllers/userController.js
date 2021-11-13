//user controller

const UserModel = require('../models/user');
const bcrypt = require('bcrypt');

exports.registerNewUser = async (req, res) => {
    //generating salt
    const salt = await bcrypt.genSalt(10);

    const { userName, userSurname, email, password, confirmPassword } = req.body;

    try {
        if(password !== confirmPassword) {
            return res.status(400).json({
                msg: "Passwords are not equal"
            });
        }
        let user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({
                msg: "User Already Exists"
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
        req.session.flash = { type: 'success', text: 'Your account was successfully created!'}
        res.redirect("/users/login");
    } catch (err) {
        console.log(err.message);
    }

};

exports.loginUser = async (req, res) => {
    
    const { email, password } = req.body;

    console.log(email)
    console.log(password)

    const user = await UserModel.findOne({ email });

    if(!user){
        return res.status(400).json({
            msg: "Uzivatel nenalezen"
        });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(400).json({
            msg: "Spatne heslo"
        });
    }

    req.session.userId = user._id;
    req.session.flash = { type: 'success', text: 'You successfully logged in! Welcome ' + user.userName + '! :)'}

    return res.redirect("/");



};

exports.logout = function (req, res, next) {
    if(req.session){
        req.session.destroy(function(err){
            if(err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        })
    }
};

exports.myProfile = async (req, res) => {
    let user = await UserModel.findById(req.session.userId);
    res.render('myProfile', {
        title: 'My profile',
        username: user.userName,
        surname: user.userSurname,
        email: user.email
    });
};



exports.showUser = async (req, res) => {
    let user = await UserModel.findById(req.session.userId);
    console.log(user)
    res.redirect("/");
}
