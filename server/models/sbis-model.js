const Sequelize = require('sequelize')

module.exports = function(sequelize) { 
    return sequelize.define('sbis', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: true,
        },
        Cookie: {
            type: Sequelize.CHAR,
            allowNull: false,
        },
        SBISAccessToken: {
            type: Sequelize.CHAR,
            allowNull: false
        },
        expiredIn: {
            type: Sequelize.DATE,
            allowNull: false
        }
    }, 
    {
        timestamps: false,
        tablename: 'sbis',
        freezeTableName: true
    });
}