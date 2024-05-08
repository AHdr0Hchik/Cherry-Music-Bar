const Sequelize = require('sequelize')

module.exports = function(sequelize) { 
    return sequelize.define('users', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: true
        },
        role: {
            type: Sequelize.STRING,
            allowNull: true
        },
        date_of_reg: {
            type: Sequelize.DATE,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            allowNull: true
        },
        firstname: {
            type: Sequelize.STRING,
            allowNull: true
        },
        lastname: {
            type: Sequelize.STRING,
            allowNull: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        address: {
            type: Sequelize.STRING,
            allowNull: true
        },
        phone_number: {
            type: Sequelize.STRING,
            allowNull: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true
        },
        uuid: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isActive: {
            type: Sequelize.TINYINT,
            allowNull: true
        },

    }, 
    {
        timestamps: false,
        tablename: 'users',
        freezeTableName: true
    });
}