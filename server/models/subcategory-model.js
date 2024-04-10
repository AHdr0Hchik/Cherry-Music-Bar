const Sequelize = require('sequelize')

module.exports = function(sequelize) { 
    return sequelize.define('menu_subcategories', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: true
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        subcategory_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        category: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        hidden: {
            type: Sequelize.TINYINT,
            allowNull: true
        },
        imgUrl: {
            type: Sequelize.STRING,
            allowNull: true
        },
    }, 
    {
        timestamps: false,
        tablename: 'menu_subcategories'
    });
}