// routing of index pages

var express = require("express");
var router = express.Router();
var auth = require('../auth');
var view_controller = require('../controllers/viewController');

router.get('/', auth.requiresLogin, view_controller.getIndexPage);

router.get('/about', auth.requiresLogin, function(req, res){
    res.render('about');
});

router.get('/avatar', auth.requiresLogin, function(req, res){
    res.render('avatar');
});

module.exports = router;