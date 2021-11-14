// routing of users

var express = require("express");
var router = express.Router();
var auth = require('../auth');
var user_controller = require('../controllers/userController');

router.get("/", auth.requiresLogin, (req, res) => {
    res.render("user");
});

// GET - router Login
router.get("/login", (req, res) => {
    res.render("login", {
        title: 'Login'
    });
});

// GET - router Register
router.get("/register", (req, res) => {
    res.render("register", {
        title: "Register"
    })
});

// POST - router Login
router.post("/login", user_controller.loginUser);

// POST - router Register
router.post("/register", user_controller.registerNewUser);

// GET - router Logout
router.get("/logout", user_controller.logout);

router.get("/user", auth.requiresLogin, user_controller.showUser);

router.get("/myProfile", auth.requiresLogin, user_controller.myProfile);

router.post("/myProfile", auth.requiresLogin, user_controller.editMyProfile);

module.exports = router;