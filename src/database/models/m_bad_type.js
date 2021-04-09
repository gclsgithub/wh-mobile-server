const model_Sequelize = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define("m_bad_type", {
        id: {
            type: model_Sequelize.DataTypes.INTEGER,
            allowNull: false, //非空
            autoIncrement: true, //自动递增
            primaryKey: true //主键
        },
        type1: {
            type: model_Sequelize.DataTypes.STRING(1),
            field: "type1",
            allowNull: true
        },
        type1_str: {
            type: model_Sequelize.DataTypes.STRING(20),
            field: "type1_str",
            allowNull: true
        },
        type2: {
            type: model_Sequelize.DataTypes.STRING(3),
            field: "type2",
            allowNull: true
        },
        type2_str: {
            type: model_Sequelize.DataTypes.STRING(20),
            field: "type2_str",
            allowNull: true
        }
    },
    {
        tableName: 'm_bad_type',
        timestamps: false,
    })
}