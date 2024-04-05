const Database = require('./Database');

class OrderLine {
    constructor(name, category, subcategory) {
        this.name = name,
        this.category = category,
        this.subcategory = subcategory
    }
    
    id;
    techCard = new Array;
    selfCost;
    price = 0;
    price30 = 0;
    price36 = 0;
    price50 = 0;
    description = '';


    Id(id) {
        if(!id) return this.id;
        else this.id = id;
    } 

    Name(name) {
        if(!name) return this.name;
        else this.name = name;
    } 

    Price(price) {
        if(!price) return this.price;
        else this.price = price;
    }

    Price30(price30) {
        if(!price30) return this.price30;
        else this.price30 = price30;
    }

    Price36(price36) {
        if(!price36) return this.price36;
        else this.price36 = price36;
    }

    Price50(price50) {
        if(!price50) return this.price50;
        else this.price50 = price50;
    }

    Category(category) {
        if(!category) return this.category;
        else this.category = category;
    }

    Subcategory(subcategory) {
        if(!subcategory) return this.subcategory;
        else this.subcategory = subcategory;
    }

    TechCard(techCard) {
        if(!techCard) return this.techCard;
        else this.techCard = techCard;
    }

    Description(description) {
        if(!description) return this.description;
        else this.description = description;
    }

    //get from db
    async getAllOrderLines() {
        const db = new Database;
        const [results] = await db.connection.promise().query('SELECT * FROM Menu;');
        return results;
    }

    async getOrderLineByName() {
        try {
            const db = new Database;
            const [results] = await db.connection.promise().query('SELECT * FROM Menu WHERE name = ?', [this.name]);
            return results[0];
        } catch(e) {
            return false;
        }
    }

    async getOrderLineById() {
        try {
            const db = new Database;
            const [results] = await db.connection.promise().query('SELECT * FROM Menu WHERE id = ?', [this.id]);
            return results[0];
        } catch(e) {
            return false
        } 
    }

    //add and update db
    async addOrderLineToDB() {
        const db = new Database;
        await db.connection.promise().query('INSERT INTO Menu (name, category, subcategory, price, price30, price36, price50, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
        [this.name, this.category, this.subcategory, this.price, this.price30, this.price36, this.price50, this.description])
    }

    async updateName() {
        const db = new Database;
        await db.connection.promise().query('UPDATE Menu SET name=? where id=?',
        [this.name, this.id]);
    }

    async updatePrice() {
        const db = new Database;
        await db.connection.promise().query('UPDATE Menu SET price=?, price30=?, price36=?, price50=? where id=?',
        [this.price, this.price30, this.price36, this.price50, this.id]);
    }

    async updateDescription() {
        const db = new Database;
        await db.connection.promise().query('UPDATE Menu SET description=? where id=?',
        [this.description, this.id]);
    }
    
    async addElementInTechCard(element, mass) {
        const db = new Database;

        const [results] = await db.connection.promise().query('SELECT techCard FROM Menu WHERE id=?' [this.id]);
        if(!results) {
            return await db.connection.promise().query('INSERT INTO Menu (techCard) VALUES (?)', [`${element}, ${mass}; `]);
        }
        return await db.connection.promise().query('INSERT INTO Menu (techCard) VALUES (?)', [`${results[0].techCard} ${element}, ${mass}; `]);
    }
}
module.exports = OrderLine;