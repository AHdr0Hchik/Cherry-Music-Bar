const Sequelize = require('sequelize')

module.exports = function(sequelize) { 
    return sequelize.define('menu', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        category: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        subcategory: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        techCard: {
            type: Sequelize.STRING,
            allowNull: true
        },
        price: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        price30: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        price36: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        price50: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        imgUrl: {
            type: Sequelize.STRING,
            allowNull: true
        },
        is_forSite: {
            type: Sequelize.TINYINT,
            allowNull: true
        },
        is_withPack: {
            type: Sequelize.TINYINT,
            allowNull: true
        },
        pack_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        is_official: {
            type: Sequelize.TINYINT,
            allowNull: true
        },
        externalId: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        nomNumber: {
            type: Sequelize.TEXT,
            allowNull: true
        }
    }, 
    {
        timestamps: false,
        tablename: 'menu',
        freezeTableName: true
    });
}