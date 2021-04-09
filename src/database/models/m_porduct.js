const model_Sequelize = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define("m_porduct", {
        id: {
            type: model_Sequelize.DataTypes.INTEGER,
            allowNull: false, //非空
            autoIncrement: true, //自动递增
            primaryKey: true //主键
        },
        type: {
            type: model_Sequelize.DataTypes.STRING(1),
            field: "type",
            allowNull: true
        },
        name: {
            type: model_Sequelize.DataTypes.STRING(50),
            field: "name",
            allowNull: true
        }
    },
    {
        tableName: 'm_porduct',
        timestamps: false,
    })
}