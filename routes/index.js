// routing of index pages

var express = require("express");
var router = express.Router();
var auth = require('../auth');
var view_controller = require('../controllers/viewController');

router.get('/', auth.requiresLogin, view_controller.getIndexPage);

router.get('/settings', auth.requiresLogin, view_controller.getSettings);

router.post('/applySettings', auth.requiresLogin, view_controller.applySettings);

module.exports = router;