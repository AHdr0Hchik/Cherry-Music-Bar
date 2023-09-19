const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
   if (req.url === '/index') {
      fs.readFile('C:\\Users\\Andrey\\Desktop\\testProject\\index.html', (err, data) => {
         if (err) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('404 Not Found');
            res.end();
         } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
         }
      });
   }
   else if (req.url === 'C:\\Users\\Andrey\\Desktop\\testProject\\css\\style.css') {
      fs.readFile('style.css', (err, data) => {
         if (err) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('404 Not Found');
            res.end();
         } else {
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(data);
            res.end();
         }
      });
   } else {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.write('404 Not Found');
      res.end();
   }
});

server.listen(3000, () => {
   console.log('Server is running on port 3000');
});