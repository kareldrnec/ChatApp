//express - app.js (SERVER)
const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const path = require('path');
const i18n = require('i18n');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const dotenv = require('dotenv').config();
const InitiateMongoServer = require('./config/db');
const helmet = require('helmet');
const port = process.env.PORT || 3000;
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');
const app = express();

// Swagger
var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");

// Swagger options
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "ChatApp API with Swagger",
            version: "0.1.0",
            description: "This is a simple Chat Application made with Express and documented with Swagger"
        },
        servers: [{
            url: "http://localhost/3000"
        }]
    },
    apis: ["./routes/*.js", "./models/*.js"]
}

const specs = swaggerJsdoc(options);

// serve Swagger documentation
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs));


// Message/Post Controller
const message_controller = require('./controllers/messageController');
const post_controller = require('./controllers/postController');

// socket.io prepare
const server = http.createServer(app);
const { Server } = require("socket.io");

//server listen
server.listen(port, () => {
    console.log('Example app listening at PORT 3000')
});

// setting socket.io
var io = new Server(server);
exports.io = io;

io.on("connection", (socket) => {
    socket.on('room', function(room) {
        socket.join(room)
    });
    socket.on('chat message', message_controller.sendMessage);
    socket.on('typing', message_controller.typing);
    socket.on('new post', post_controller.addNewPost);
});

// i18n configure
i18n.configure({
    locales: ['en', 'cz'],
    cookie: 'locale',
    directory: path.join(__dirname, '/locales'),
    defaultLocale: 'en'
})

// cookie parser
app.use(cookieParser());

// i18n init
app.use(i18n.init);

// setting handlebars engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    extname: '.handlebars',
    helpers: {
        // helpers
        i18n: function() {
            return i18n.__.apply(this, arguments);
        },
        ifEquals: function(value1, value2, options) {
            return (value1 == value2) ? options.fn(this) : options.inverse(this);
        }
    }
}));

// set view engine
app.set('view engine', 'handlebars');

// serve static files
app.use(express.static(path.join(__dirname, '/public')));

// mongodb init
InitiateMongoServer();

// store sessions
const store = new MongoStore({
    uri: process.env.MONGODB_URI,
    collection: "mySession"
});

// session
app.use(session({
    secret: 'SECRET KEY',
    resave: false,
    saveUninitialized: false,
    store: store
}));

// express-flash-message
app.use((req, res, next) => {
    if (req.session.flash) {
        res.locals.flash = req.session.flash;
        delete req.session.flash;
    }
    next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// express-mongo-sanitize
app.use(mongoSanitize());

// method override POST TO PUT/DELETE
app.use(methodOverride('_method'));

// helmet.js
const scriptSources = ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'code.jquery.com', 'stackpath.bootstrapcdn.com',
    'cdnjs.cloudflare.com', 'kit.fontawesome.com'
];
const styleSources = ["'self'", "'unsafe-inline'", 'stackpath.bootstrapcdn.com']

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: scriptSources,
            styleSrc: styleSources,
            fontSrc: ["'self'", 'https://ka-f.fontawesome.com'],
            connectSrc: ["'self'", 'https://ka-f.fontawesome.com'],
            imgSrc: ["'self'", 'data:']
        }
    }
}))

// routing
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));
app.use('/conversations', require('./routes/conversations'));

// error page handling - 500
app.use((err, req, res, next) => {
    return res.status(500).render('error', {
        title: req.__("error"),
        code: "500",
        text: req.__("500 response")
    });
});

// error page handling - 404
app.use((req, res, next) => {
    return res.status(404).render('error', {
        title: req.__("error"),
        code: "404",
        text: req.__("404 response")
    })
});

module.exports = app;