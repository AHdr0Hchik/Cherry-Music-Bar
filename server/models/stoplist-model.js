const Sequelize = require('sequelize')

module.exports = function(sequelize) { 
    return sequelize.define('stoplist', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        dish_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true
        }
    }, 
    {
        timestamps: false,
        tablename: 'stoplist',
        freezeTableName: true
    });
}