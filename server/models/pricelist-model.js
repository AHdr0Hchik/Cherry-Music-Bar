const Sequelize = require('sequelize')

module.exports = function(sequelize) { 
    return sequelize.define('pricelist', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: true,
        },
        dish_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        size: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        price: {
            type: Sequelize.FLOAT,
            allowNull: false
        }
    }, 
    {
        timestamps: false,
        tablename: 'pricelist',
        freezeTableName: true
    });
}