//express
const express = require('express');
const app = express();
//setting port
const port = process.env.PORT || 3000;
//handlebars
const exphbs = require('express-handlebars');

//idk
const path = require('path');

//var bodyParser = require('body-parser')


const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);






//setting handlebars engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    extname: '.handlebars'
}));

app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '/public')));

//mongodb
const InitiateMongoServer = require('./config/db');
InitiateMongoServer();


const store = new MongoStore({
    uri: "mongodb+srv://user1234:user1234@cluster0.gr9ky.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
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
    if(req.session.flash){
        res.locals.flash = req.session.flash;
        delete req.session.flash;
    }
    next();
});



app.use(express.json());


app.use(express.urlencoded({ extended: true }));


//disable - mrknout na to
//app.disable('x-powered-by');


//routing
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));

//error page handlers
//dodelat
app.use((req, res, next) => {
    res.status(400).render('error', {
        title: "Error",
        variable: "405"
    });
});



//app listen
app.listen(port, () => {
    console.log('Example app listening at PORT 3000')
});
//module.exports = app;