var express = require("express");
var router = express.Router();
var auth = require('../auth');

router.get('/', auth.requiresLogin, function(req, res){
    res.render('index');
});

router.get('/about', auth.requiresLogin, function(req, res){
    res.render('about');
});

router.get('/avatar', auth.requiresLogin, function(req, res){
    res.render('avatar');
});

module.exports = router;