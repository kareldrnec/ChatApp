//express - app.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const exphbs = require('express-handlebars');
const http = require('http');
const path = require('path');
const i18n = require('i18n');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const InitiateMongoServer = require('./config/db');

// Message/Post Controller
const message_controller = require('./controllers/messageController');
const post_controller = require('./controllers/postController');

// socket.io priprava
const server = http.createServer(app);
const { Server } = require("socket.io");
//server listen
server.listen(port, () => {
    console.log('Example app listening at PORT 3000')
});

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

//i18n configure
i18n.configure({
    locales: ['en', 'cz'],
    cookie: 'locale',
    directory: path.join(__dirname, '/locales'),
    defaultLocale: 'en'
})
app.use(cookieParser());
app.use(i18n.init);

//setting handlebars engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    extname: '.handlebars',
    helpers: {
        i18n: function () {
            return i18n.__.apply(this, arguments);
        },
        ifEquals: function (value1, value2, options) {
            return (value1 == value2) ? options.fn(this) : options.inverse(this);
        }
    }
}));

app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '/public')));

//mongodb
InitiateMongoServer();

const store = new MongoStore({
    uri: "mongodb+srv://user1234:user1234@cluster0.gr9ky.mongodb.net/PWA?retryWrites=true&w=majority",
    collection: "mySession"
});

app.use(session({
    secret: 'SECRET KEY',
    resave: false,
    saveUninitialized: false,
    store: store
}));

//express-flash-message
app.use((req, res, next) => {
    if (req.session.flash) {
        res.locals.flash = req.session.flash;
        delete req.session.flash;
    }
    next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//disable - mrknout na to
//app.disable('x-powered-by');

//routing
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
// idk jestli nesmazat posts .. uvidime
app.use('/posts', require('./routes/posts'));
app.use('/conversations', require('./routes/conversations'));

//error page handlers
//dodelat
app.use((req, res, next) => {
    res.status(400).render('error', {
        title: "Error",
        variable: "405"
    });
});

//module.exports = app;