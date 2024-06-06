const Sequelize = require('sequelize')

module.exports = function(sequelize) { 
    return sequelize.define('sales', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: true
        },
        name: {
            type: Sequelize.CHAR(32),
            allowNull: true
        },
        target_type: {
            type: Sequelize.CHAR(32),
            allowNull: false
        },
        target_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        sale: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        expiredIn: {
            type: Sequelize.DATEONLY,
            allowNull: true
        }
    }, 
    {
        timestamps: false,
        tablename: 'sales',
        freezeTableName: true
    });
}