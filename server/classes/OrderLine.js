const Database = require('./Database');
const Model = require('../models');

class OrderLine {
    constructor(name, subcategory) {
        this.name = name,
        this.subcategory = subcategory
    }
    category;
    id;
    techCard = new Array;
    selfCost;
    price = 0;
    price30 = 0;
    price36 = 0;
    price50 = 0;
    description = '';
    forSite = false;
    withPack = false;
    pack_id = -1;
    is_official = false;

    type;

    Type(type) {
        if(!type) return this.forSite;
        else this.type = type
    }

    ForSite(forSite) {
        if(!forSite) return this.forSite;
        else this.forSite = forSite;
    }

    WithPack(withPack) {
        if(!withPack) return this.withPack;
        else this.withPack = withPack;
    }

    Pack_Id(pack_id) {
        if(!pack_id) return this.pack_id;
        else this.pack_id = pack_id;
    }

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

    Is_official(is_official) {
        if(!is_official) return this.is_official;
        else this.is_official = is_official;
    }

    //get from db
    async getAllOrderLines() {
        const db = new Database;
        const menu = await Model.menu.findAll();
        //const menu = await db.connection.promise().query('SELECT * FROM Menu;');
        return menu;
    }

    async getOrderLineByName() {
        try {
            const db = new Database;
            const results = await Model.menu.findOne({
                where: { name : this.name }
            })
            //const [results] = await db.connection.promise().query('SELECT * FROM Menu WHERE name = ?', [this.name]);
            return results;
        } catch(e) {
            return false;
        }
    }

    async getOrderLineById() {
        try {
            const orderLine = Model.menu.findOne({
                where: {id: this.id}
            });
            
            return orderLine;
        } catch(e) {
            return false
        } 
    }

    async setCategoryBySubcategory() {
        const db = new Database;
        const subcategories = await Model.subcategories.findAll({
            attributes: ['id', 'category']
        })
        //const [subcategories] = await db.connection.promise().query('SELECT id, category FROM menu_subcategories;')

        let subcategory = subcategories.find(item => item.id == this.subcategory);
        if (subcategory) {
            this.category = subcategory.category;
        }
    }

    async getCategoryId() {
        this.category = await Model.menu.findOne({
            attributes: ['category'],
            where: {
                id: this.id
            }
        });
        return this.category;
    }

    //add and update db
    async addOrderLineToDB() {
        const db = new Database;
        await db.connection.promise().query('INSERT INTO Menu (name, category, subcategory, price, price30, price36, price50, is_forSite, is_withPack, pack_id,, is_official) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [this.name, this.category, this.subcategory, this.price, this.price30, this.price36, this.price50, this.forSite, this.withPack, this.pack_id, this.is_official]);
    }
    async updadeInDB() {
        const db = new Database;
        await db.connection.promise().query('UPDATE Menu SET name=?, category=?, subcategory=?, price=?, price30=?, price36=?, price50=?, is_forSite=?, is_withPack=?, pack_id=?, is_official=? where id=?;',
        [this.name, this.category, this.subcategory, this.price, this.price30, this.price36, this.price50, this.forSite, this.withPack, this.pack_id, this.is_official, this.id]);
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