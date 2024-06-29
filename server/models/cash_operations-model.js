const Sequelize = require('sequelize')

module.exports = function(sequelize) { 
    return sequelize.define('cash_operations', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: true
        },
        datetime: {
            type: Sequelize.DATE,
            allowNull: false
        },
        type: {
            type: Sequelize.CHAR,
            allowNull: false
        },
        cash: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        description: {
            type: Sequelize.CHAR,
            allowNull: true
        }
    }, 
    {
        timestamps: false,
        tablename: 'cash_operations',
        freezeTableName: true
    });
}