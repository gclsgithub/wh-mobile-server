const model_Sequelize = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define("m_maintenance_status", {
        id: {
            type: model_Sequelize.DataTypes.INTEGER,
            allowNull: false, //非空
            autoIncrement: true, //自动递增
            primaryKey: true //主键
        },
        desp: {
            type: model_Sequelize.DataTypes.STRING(50),
            field: "desp",
            allowNull: true
        }
    },
    {
        tableName: 'm_maintenance_status',
        timestamps: false,
    })
}