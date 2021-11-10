var express = require("express");
var router = express.Router();
var auth = require('../auth');

router.get('/', function(req, res, next){
    res.render('index');
});

router.get('/about', function(req, res, next){
    res.render('about');
});

router.get('/avatar', function(req, res, next){
    res.render('avatar');
});

module.exports = router;