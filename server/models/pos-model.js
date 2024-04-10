const Sequelize = require('sequelize')

module.exports = function(sequelize) { 
    return sequelize.define('pos', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        count: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        printer: {
            type: Sequelize.STRING,
            allowNull: false
        },
        can_works: {
            type: Sequelize.STRING,
        },
        can_sells: {
            type: Sequelize.STRING
        }
    }, 
    {
        timestamps: false,
        tablename: 'pos'
    });
}