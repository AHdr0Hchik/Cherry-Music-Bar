const Database = require('./Database');

class Tables {
    constructor(name, count) {
        this.name = name,
        this.count = count,
        this.db = new Database;
    }

    async getTables() {
        try{
            const [tables] = await this.db.connection.promise().query('SELECT * FROM pos;');
            if(!tables[0]) return false;
            return tables;
        } catch(e) {
            console.log(e);
            return false;
        }

    }

    async newTables() {
        try {
            return await this.db.connection.promise().query('INSERT INTO pos (name, count) VALUES (?, ?);', [this.name, this.count]);
        } catch(e) {
            console.log(e);
            return false;
        }
    }
}
module.exports = Tables;