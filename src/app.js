var express = require('express')
var router = require('./routes/routes')
var bodyParser = require('body-parser')
const session = require("express-session");
const flash = require('connect-flash');

var app = express();


// Configuração do express-session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Configuração do connect-flash
app.use(flash());

// Sessions

app.use(session({
    secret: "qualquercoisa", cookie: { maxAge: 30000000 }
}))

// parse application/x-www-form-urlencoded
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.set('view engine', 'ejs');

app.use('/upload', express.static('upload'))
app.use( express.static('public'))


app.use('/', router);

app.listen(3001, ()=>{
    console.log('Servidor On');
})