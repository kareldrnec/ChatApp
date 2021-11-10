var express = require("express");
var router = express.Router();
var auth = require('../auth');

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


//logout
//


module.exports = router;