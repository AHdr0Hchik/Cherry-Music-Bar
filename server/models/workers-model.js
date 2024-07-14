const Sequelize = require('sequelize')

module.exports = function(sequelize) { 
    return sequelize.define('workers', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true
        },
        role: {
            type: Sequelize.CHAR,
            allowNull: false
        },
        access_code: {
            type: Sequelize.CHAR,
            allowNull: false,
            unique: true
        }
    }, 
    {
        timestamps: false,
        tablename: 'workers',
        freezeTableName: true
    });
}