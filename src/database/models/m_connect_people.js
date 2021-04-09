const model_Sequelize = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define("m_connect_people", {
        id: {
            type: model_Sequelize.DataTypes.INTEGER,
            allowNull: false, //非空
            autoIncrement: true, //自动递增
            primaryKey: true //主键
        },
        maintanceId: {
            type: model_Sequelize.DataTypes.INTEGER,
            field: "maintance_id",
            allowNull: false
        },
        name: {
            type: model_Sequelize.DataTypes.STRING(50),
            field: "name",
            allowNull: false
        },
        address: {
            type: model_Sequelize.DataTypes.STRING(250),
            field: "address",
            allowNull: false
        },
        phone: {
            type: model_Sequelize.DataTypes.STRING(50),
            field: "phone",
            allowNull: false
        }
    },
    {
        tableName: 'm_connect_people',
        timestamps: false,
    })
}