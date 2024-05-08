const Sequelize = require('sequelize');
const { Op } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, '', {
    dialect: "mysql",
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    logging: false
});

const pos = require('./pos-model')(sequelize);
const categories = require('./category-model')(sequelize);
const subcategories = require('./subcategory-model')(sequelize);
const menu = require('./menu-model')(sequelize);
const users = require('./user-model')(sequelize);


module.exports = {
    Op: Op,
    sequelize: sequelize,
    pos: pos,
    categories: categories,
    subcategories: subcategories,
    menu: menu,
    users: users
}