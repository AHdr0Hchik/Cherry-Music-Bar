const express = require('express');
const path = require('path');
const mysql = require("mysql2");
const fs = require("fs");
const bodyParser = require('body-parser');
const crypto = require('crypto');
const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;



const app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
   extended: true
}));
app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 4000;
const HOSTNAME = process.env.HOSTNAME;

/*http.createServer(function (req, res){
   const url = req.url;
   console.log(url);

   switch (url) {
      case('/'):
         app.get('/', (req, res) => {
            res.render(createPath('index'));
         });
      default:
         res.statusCode = 404;
         console.log('404');
   }


}).listen(PORT, HOSTNAME);*/

const connection = mysql.createConnection({
   host: "localhost",
   port: "3306",
   user: "root",
   database: "cherrymenu",
   password: "Tempor82"
});

const sessionStore = new MySQLStore({
   checkExpirationInterval: parseInt(process.env.SESSIONSDB_CHECK_EXP_INTERVAL, 10),
   expiration: parseInt(process.env.SESSIONSDB_EXPIRATION, 10)
}, connection);

/*
const connection = mysql.createConnection({
   host: "127.0.0.1",
   port: "3306",
   user: "sqluser",
   database: "cherrymenu",
   password: "password"
});
 */

const token = 'abcdefg';

/* Create a cookie that expires in 1 day */
var expireDate = new Date();
expireDate.setDate(expireDate.getDate() + 1);

app.use(session({
   resave: true,
   saveUninitialized: true,
   secret: process.env.SESSIONSDB_SECRET,
   store: sessionStore,
   cookie: { expires: expireDate }
}));


const createPath = (page) => path.resolve(__dirname, 'public', `${page}.ejs`);

app.listen(PORT,() => {
   console.log(`Listening port ${PORT}`);
});



app.get('/', (req, res) => {
   res.render(createPath('index'));
})
app.get('/login', (req, res) => {
   res.render(createPath('login'));
});

//features
app.get('/register', (req, res) => {
   res.render(createPath('register'));
});

//categories
app.get(`/japan_kitchen`,(req, res) => {
   const category = 'japan_kitchen';
   res.render(createPath(`${category}`));

});
app.get(`/main_kitchen`,(req, res) => {
   const category = 'main_kitchen';
   res.render(createPath(`${category}`));

});

app.get(`/bakery`,(req, res) => {
   const category = 'bakery';
   res.render(createPath(`${category}`));

});

//admin pages
app.get(`/add_menu`,(req, res) => {
   const category = 'add_menu';
   res.render(createPath(`${category}`));
   tableNames();
});
app.get(`/admin_orders`,(req, res) => {
   const category = 'admin_orders';
   res.render(createPath(`${category}`));
});


getAppGet('burgers', 'burgers');
//subcategories: bakery
getAppGet('bakery', 'pizza');
getAppGet('bakery', 'khachapuri');
getAppGet('bakery', 'sbor_pizza');
//subcategories: japan
getAppGet('japan_kitchen', 'rolls');
getAppGet('japan_kitchen', 'gunkans');
getAppGet('japan_kitchen', 'sets');
getAppGet('japan_kitchen', 'japan_burger');
//subcategories: main_kitchen
getAppGet('main_kitchen', 'starters');
getAppGet('main_kitchen', 'main_dishes');
getAppGet('main_kitchen', 'side_dishes');
getAppGet('main_kitchen', 'desserts');
getAppGet('main_kitchen', 'hot_appetizers');
getAppGet('main_kitchen', 'cold_platter');


app.post("/toProcess", function(req, res){
   console.log(payProcess(req.body.price, req.body.cardnum));
   fs.writeFile("./public/json/order.json", JSON.stringify(req.body.itemsData), function(err, result) {
      if(err) console.log('error', err);
   });
   console.log('Payment in process');
});

app.post('/addMenu', (req, res) => {
   setTableData(req.body.name, req.body.description, req.body.price, req.body.category);
   res.redirect('/add_menu');
});

function getAppGet(category, subcategory){
   app.get(`/${category}/${subcategory}`,(req, res) => {
      getTableDataJSON(subcategory);
      res.render(createPath('menu'), {subcategory: `${subcategory}`});
   });
}

function setTableData(nameLot, descriptionLot, priceLot, categoryLot) {
   connection.connect(function(err){
      if (err) {
         return console.error("Ошибка: " + err.message);
      }
      else{
         console.log("Подключение к серверу MySQL успешно установлено");
      }
   });

   connection.query(`INSERT INTO ? (id, name, description, price, imgUrl) VALUES (?,?,?,?,?)`, [categoryLot, null, nameLot, descriptionLot, priceLot, './jpgs/dishes/dish.jpg'], function(err, data) {
      if(err) return console.log(err);
   });
}

function getTableDataJSON(table_name){
   connection.connect(function(err){
      if (err) {
         return console.error("Ошибка: " + err.message);
      }
      else{
         console.log("Подключение к серверу MySQL успешно установлено");
      }

   });

   const sqlGet = `SELECT * FROM ${table_name}`;
   connection.query(sqlGet, function(err, results) {
      if(err) console.log(err);
      fs.writeFile("./public/json/thing.json", JSON.stringify(results), function(err, result) {
         if(err) console.log('error', err);
      });
   });

   connection.end();
};

function tableNames() {
   connection.connect(function(err){
      if (err) {
         return console.error("Ошибка: " + err.message);
      }
      else{
         console.log("Подключение к серверу MySQL успешно установлено");
      }
   });

   connection.query(`SELECT table_name FROM information_schema.tables WHERE table_schema ='cherrymenu';`, function(err, results){
      if(err) console.log(err);
      fs.writeFile("./public/json/categories.json", JSON.stringify(results), function(err, result) {
         if(err) console.log('error', err);
      });
   });

}

function payProcess(price, cardNum) {
   const payAdress = `${cardNum}/${price}/${token}`;

   return payAdress;
}



