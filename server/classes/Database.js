const mysql = require('mysql2');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({path: './config/.env'});

class Database {
    constructor() {
        this.connection = mysql.createConnection({
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            user: process.env.DATABASE_USER,
            database: process.env.DATABASE
         });
    }

    async doQuery(sql, options) {
        try {
          await this.connection.promise().query(sql, options)
            .then(([results]) => {
              this.results = results;
            });
        } catch (error) {
          console.log(error);
        }
      }

    async getTableDataJSON(sql, filename){
          const [results] = await this.connection.promise().query(sql);
          const resultsJSON = JSON.stringify(results);
          if (fs.existsSync(`../public/json/${filename}.json`)) {
            fs.truncate(`../public/json/${filename}.json`,0, function(err) {
              if(err) console.log('error', err);
              fs.writeFile(`../public/json/${filename}.json`, resultsJSON, function(err, result) {
                if(err) console.log('error', err);
              });
            });
          } else {
            fs.writeFile(`../public/json/${filename}.json`, resultsJSON, function(err, result) {
              if(err) console.log('error', err);
            });
          } 
          this.connection.end();  
    }
}
    


module.exports = Database;