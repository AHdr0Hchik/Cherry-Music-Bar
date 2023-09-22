const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs')

const PORT = 4000;

const createPath = (page) => path.resolve(__dirname, 'html', `${page}.html`);

app.listen(PORT, 'localhost', (error) => {
   error ? console.log(error) : console.log(`Listening port ${PORT}`);
});

app.get('/', (req, res) => {
   res.sendFile(createPath('index'));
});
app.get('/login', (req, res) => {
   res.sendFile(createPath('login'));
});
app.get('/register', (req, res) => {
   res.sendFile(createPath('register'));
});