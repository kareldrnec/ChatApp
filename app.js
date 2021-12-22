//express
const express = require('express');
const app = express();
//setting port
const port = process.env.PORT || 3000;
//handlebars
const exphbs = require('express-handlebars');
const http = require('http');

//idk
const path = require('path');


const MessageModel = require('./models/message')

//var bodyParser = require('body-parser')

// socket.io priprava
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


io.on("connection", (socket) => {
    socket.on('chat message', async(msg, senderName, senderID, conversationID) => {
        io.emit('chat message', msg, senderName, senderID, conversationID);
        let mes = new MessageModel({
            text: msg,
            conversationID: conversationID,
            senderID: senderID
        })
        console.log(mes)
        await mes.save()
    });
});



const message_controller = require("./controllers/messageController");

//i18n - locales
const i18n = require('i18n');

const cookieParser = require('cookie-parser')

const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);


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
const InitiateMongoServer = require('./config/db');
InitiateMongoServer();


const store = new MongoStore({
    uri: "mongodb+srv://user1234:user1234@cluster0.gr9ky.mongodb.net/PWA?retryWrites=true&w=majority",
    collection: "mySession"
})

app.use(session({
    secret: 'SECRET KEY',
    resave: false,
    saveUninitialized: false,
    store: store
}
))

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



//app listen
server.listen(port, () => {
    console.log('Example app listening at PORT 3000')
});
//module.exports = app;