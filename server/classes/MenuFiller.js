const Database = require('./Database');

class MenuFiller {
    constructor() {
        this.db = new Database();
    }
}
module.exports = MenuFiller;