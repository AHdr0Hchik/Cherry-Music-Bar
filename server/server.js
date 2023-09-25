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

//features
app.get('/register', (req, res) => {
   res.sendFile(createPath('register'));
   console.log(req, res)
});

//categories
app.get(`/japan_kitchen`,(req, res) => {
   const category = 'japan_kitchen';
   res.sendFile(createPath(`${category}`));

});
app.get(`/kitchen`,(req, res) => {
   const category = 'kitchen';
   res.sendFile(createPath(`${category}`));

});
app.get(`/burgers`,(req, res) => {
   const category = 'burgers';
   res.sendFile(createPath(`${category}`));

});

app.get(`/bakery`,(req, res) => {
   const category = 'bakery';
   res.sendFile(createPath(`${category}`));

});

//subcategories: japan
app.get('/japan_kitchen/rolls', (req, res) => {
   const category = 'rolls';
   res.sendFile(createPath(`${category}`));
   getTableData(`${category}`);
});

//subcategories: bakery
app.get(`/bakery/pizzas`,(req, res) => {
   const category = 'pizzas';
   res.sendFile(createPath(`${category}`));
   getTableData(`${category}`);

});
app.get(`/bakery/khachapuri`,(req, res) => {
   const category = 'khachapuri';
   res.sendFile(createPath(`${category}`));
   getTableData(`${category}`);

});
app.get(`/bakery/sbor_pizza`,(req, res) => {
   const category = 'sbor_pizza';
   res.sendFile(createPath(`${category}`));
   getTableData(`${category}`);

});




function getTableData(table_name){
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
      const res = results;
      console.log(res);
   });

   connection.end(function(err) {
      if (err) {
         return console.log("Ошибка: " + err.message);
      }
      console.log("Подключение закрыто");
   });

};

