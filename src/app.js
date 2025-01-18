var express = require('express')
var router = require('./routes/routes')
var bodyParser = require('body-parser')


require('dotenv').config();

var app = express();

// Configuração do connect-flash
const flash = require('connect-flash');
app.use(flash());

// Sessions
const session = require("express-session")
app.use(session({
    secret: process.env.SECRET_PHRASE, cookie: { maxAge: 30000000 }
}))

// parse application/x-www-form-urlencoded
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "../views"));


app.use('/upload', express.static('upload'))
app.use( express.static('public'))


app.use('/', router);

app.listen(process.env.PORT, () => {
    console.log('Servidor ON');
});