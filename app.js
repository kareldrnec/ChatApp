//express
const express = require('express');
const app = express();
//setting port
const port = process.env.PORT || 3000;
//handlebars
const exphbs = require('express-handlebars');
//router
const router = express.Router();

//idk
const path = require('path');

//mongoose
var mongoose = require('mongoose');

//express-flash-message

//setting handlebars engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    extname: '.handlebars'
}));

app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '/public')));

//routing
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


//disable - mrknout na to
//app.disable('x-powered-by');


//app listen
app.listen(port, () => {
    console.log('Example app listening at PORT 3000')
});