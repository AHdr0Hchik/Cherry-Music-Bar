//modules
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const request = require('request');

const errorMiddleware = require('./middlewares/error-middleware');
const roleMiddleware = require('./middlewares/role-middleware');
const authMiddleware = require('./middlewares/auth-middleware');

dotenv.config({path: './config/.env'});

//classes
const SBIS = require('./sbis/SBIS');
const Updater = require('./classes/Updater');
const EasyResto = require('./classes/EasyResto');


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

app.use('/updater', require('./routes/updater'));

//app.use('/api', authMiddleware, require('./routes/api'));

app.locals.isItemInStoplist = (stoplist, item) => {
   return stoplist.some(stoplisted => stoplisted.dish_id === item.id);
};
app.locals.org_name = process.env.ORG_NAME;

const easyresto = new EasyResto();
const dssagtrgs = easyresto.getDiskSerial();

(async () => {
   
   const result = await new Updater().checkForUpdates(dssagtrgs);
   console.log(result);
   if(result.has_license == false) {
      app.locals.has_license = false;
      return;
   }
   if(result.has_update && result.latest_version) {
      app.locals.has_update = true;
      app.locals.latest_version = result.latest_version;
   }
 })();

(async () => {
   await new SBIS().connection();
 })();
