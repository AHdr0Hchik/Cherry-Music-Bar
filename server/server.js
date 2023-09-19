const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const http = require('http');
var parseUrl = require('body-parser');
const app = express();

var mysql = require('mysql');

let encodeUrl = parseUrl.urlencoded({ extended: false });

//session middleware
app.use(sessions({
   secret: "thisismysecrctekey",
   saveUninitialized:true,
   cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
   resave: false
}));

app.use(cookieParser());

var con = mysql.createConnection({
   host: "localhost",
   user: "root", // my username
   password: "123456789", // my password
   database: "myform"
});

app.get('/', (req, res) => {
   res.sendFile('C:/Users/Andrey/Desktop/testProject/signUp.html');
})

app.post('/register', encodeUrl, (req, res) => {
   var firstName = req.body.firstName;
   var lastName = req.body.lastName;
   var userName = req.body.userName;
   var password = req.body.password;

   con.connect(function(err) {
      if (err){
         console.log(err);
      };
      // checking user already registered or no
      con.query(`SELECT * FROM users WHERE username = '${userName}' AND password  = '${password}'`, function(err, result){
         if(err){
            console.log(err);
         };
         if(Object.keys(result).length > 0){
            res.send("123");
         }
         else{
            //creating user page in userPage function
            function userPage(){
               // We create a session for the dashboard (user page) page and save the user data to this session:
               req.session.user = {
                  firstname: firstName,
                  lastname: lastName,
                  username: userName,
                  password: password
               };

               res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <title>Login and register form with Node.js, Express.js and MySQL</title>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body>
                    <div class="container">
                        <h3>Hi, ${req.session.user.firstname} ${req.session.user.lastname}</h3>
                        <a href="/">Log out</a>
                    </div>
                </body>
                </html>
                `);
            }
            // inserting new user data
            var sql = `INSERT INTO users (firstname, lastname, username, password) VALUES ('${firstName}', '${lastName}', '${userName}', '${password}')`;
            con.query(sql, function (err, result) {
               if (err){
                  console.log(err);
               }else{
                  // using userPage function for creating user page
                  userPage();
               };
            });

         }

      });
   });


});

app.listen(4000, ()=>{
   console.log("Server running on port 4000");
});