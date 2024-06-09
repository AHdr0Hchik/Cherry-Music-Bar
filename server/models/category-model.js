const Sequelize = require('sequelize')

module.exports = function(sequelize) { 
    return sequelize.define('menu_categories', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: true
        },
        category_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        hidden: {
            type: Sequelize.TINYINT,
            allowNull: true
        },
        is_forSite: {
            type: Sequelize.TINYINT,
            allowNull: true
        },
        imgUrl: {
            type: Sequelize.STRING,
            allowNull: true
        },
        printer: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, 
    {
        timestamps: false,
        tablename: 'menu_categories'
    });
}