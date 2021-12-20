// routing of index pages

var express = require("express");
var router = express.Router();
var auth = require('../auth');
var view_controller = require('../controllers/viewController');

router.get('/', auth.requiresLogin, view_controller.getIndexPage);

router.get('/about', auth.requiresLogin, function(req, res){
    res.render('about');
});

router.get('/settings', auth.requiresLogin, function(req, res){
    res.render('settings',
    {
        title: req.__("settings"),
        language_value: req.cookies.locale
    })
})

router.post('/applySettings', auth.requiresLogin, view_controller.applySettings);

module.exports = router;