const Sequelize = require('sequelize')

module.exports = function(sequelize) { 
    return sequelize.define('history', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: true
        },
        pos: {
            type: Sequelize.STRING,
            allowNull: true
        },
        orderDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        sum: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        sale: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        sumWithSale: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        orderLineArray: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        agentId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        deliveryAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        clientPhone: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isComplete: {
            type: Sequelize.TINYINT,
            allowNull: true
        }
    }, 
    {
        timestamps: false,
        tablename: 'history'
    });
}