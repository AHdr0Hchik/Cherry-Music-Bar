const Sequelize = require('sequelize')

module.exports = function(sequelize) { 
    return sequelize.define('easyresto', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: true
        },
        version: {
            type: Sequelize.CHAR,
            allowNull: false
        }
    }, 
    {
        timestamps: false,
        tablename: 'easyresto',
        freezeTableName: true
    });
}