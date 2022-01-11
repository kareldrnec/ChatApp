// ROUTER for users
var express = require("express");
var router = express.Router();
var auth = require('../auth');
var user_controller = require('../controllers/userController');


/**
 * @swagger
 *  tags:
 *      name: Users
 *      description: API to manage Users
 */


router.get("/", (req, res) => {
    res.redirect("/");
})


/**
 * @swagger
 *  /login:
 *      get:
 *          summary: Get the login page.
 *          tags: [Users]
 *          description: Get the login page.
 * 
 */
router.get("/login", (req, res) => {
    res.render("login", {
        title: 'Login'
    });
});

/**
 * @swagger
 *  /login:
 *      post:
 *          summary: Log the user in the application.
 *          tags: [Users]
 *          description: Log the user in the application.
 */
router.post("/login", user_controller.loginUser);



/**
 * @swagger
 *  /register:
 *      get:
 *          summary: Get the register page.
 *          tags: [Users]
 *          description: Get the register page.
 */
router.get("/register", (req, res) => {
    res.render("register", {
        title: "Register"
    })
});

/**
 * @swagger
 *  /register:
 *      post:
 *          summary: Register a new user into the application.
 *          tags: [Users]
 *          description: Register a new user into the application.
 */
router.post("/register", user_controller.registerNewUser);

/**
 * @swagger
 *  /logout:
 *      get:
 *          summary: Log the user out from the application.
 *          tags: [Users]
 *          description: Log the user out from the application.
 */
router.get("/logout", user_controller.logout);


/**
 * @swagger
 *  /myProfile:
 *      get:
 *          summary: Get my profile page.
 *          tags: [Users]
 *          description: Get my profile page.
 */
router.get("/myProfile", auth.requiresLogin, user_controller.myProfile);

/**
 * @swagger
 *  /myProfile:
 *      post:
 *          summary: Update my profile page.
 *          tags: [Users]
 *          description: Update my profile page.
 */
router.put("/myProfile", auth.requiresLogin, user_controller.editPersonalInfo);

/**
 * @swagger
 *  /deleteAccount:
 *      get:
 *          summary: Delete my account.
 *          tags: [Users]
 *          description: Delete my account.
 */
router.delete("/deleteAccount", auth.requiresLogin, user_controller.deleteAccount);

/**
 * @swagger
 *  /user/:id:
 *      get:
 *          summary: Get user's profile page.
 *          tags: [Users]
 *          description: Get user's profile page.
 */
router.get("/user/:id", auth.requiresLogin, user_controller.showUser);

module.exports = router;