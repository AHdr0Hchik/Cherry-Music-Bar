const express = require('express');
const path = require('path');
const mysql = require("mysql");


const app = express();

app.set('view engine', 'ejs')
app.use(express.static('public'));

const PORT = 4000;

const connection = mysql.createConnection({
   host: "localhost",
   port: "3306",
   user: "root",
   database: "cherrymenu",
   password: "Tempor82"
});

connection.connect(function(err){
   if (err) {
      return console.error("Ошибка: " + err.message);
   }
   else{
      console.log("Подключение к серверу MySQL успешно установлено");
   }
});

const createPath = (page) => path.resolve(__dirname, 'public', `${page}.html`);

app.listen(PORT, 'localhost', (error) => {
   error ? console.log(error) : console.log(`Listening port ${PORT}`);
});

app.get('/', (req, res) => {
   res.sendFile(createPath('index'));
   console.log(req, res)
});
app.get('/login', (req, res) => {
   res.sendFile(createPath('login'));
   console.log(req, res)
});


app.get('/register', (req, res) => {
   res.sendFile(createPath('register'));
   console.log(req, res)
});
app.get('/sushi', (req, res) => {
   res.sendFile(createPath('sushi'));
   const sqlGet = `SELECT * FROM sushi`;
   connection.query(sqlGet, function(err, results) {
      if(err) console.log(err);
      const sushi = results;
      for(let i=0; i < sushi.length; i++){
         console.log(sushi[i].name);
      }
   });

   connection.end(function(err) {
      if (err) {
         return console.log("Ошибка: " + err.message);
      }
      console.log("Подключение закрыто");
   });
});

