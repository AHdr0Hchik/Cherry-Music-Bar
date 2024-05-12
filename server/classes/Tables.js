const Database = require('./Database');

class Tables {
    constructor(name, count) {
        this.name = name,
        this.count = count,
        this.db = new Database;
    }

    async getTables() {
        try{
            const pos = await Model.pos.findAll();
            //const [tables] = await this.db.connection.promise().query('SELECT * FROM pos;');
            if(!pos) return false;
            return pos;
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