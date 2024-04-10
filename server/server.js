//modules
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Sequelize = require('sequelize');

const errorMiddleware = require('./middlewares/error-middleware');
const roleMiddleware = require('./middlewares/role-middleware');
const authMiddleware = require('./middlewares/auth-middleware');

dotenv.config({path: './config/.env'});

//classes


const app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
   extended: true
}));
app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(cookieParser('secret key'));
app.use(errorMiddleware);

app.use('/css',express.static(__dirname + '/../public/css'));
app.use('/jpgs',express.static(__dirname + '/../public/jpgs'));
app.use('/js',express.static(__dirname + '/../public/js'));
app.use('/json',express.static(__dirname + '/../public/json'));
app.use('/fonts',express.static(__dirname + '/../public/fonts'));


app.listen(process.env.PORT ,() => {
   console.log(`Listening port ${process.env.PORT}`);
});



app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/order', require('./routes/order'));
app.use('/admin', authMiddleware, roleMiddleware, require('./routes/admin'));
