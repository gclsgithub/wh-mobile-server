const model_Sequelize = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define("m_send_Info_history", {
        id: {
            type: model_Sequelize.DataTypes.INTEGER,
            allowNull: false, //非空
            autoIncrement: true, //自动递增
            primaryKey: true //主键
        },
        info_id: {
            type: model_Sequelize.DataTypes.INTEGER,
            field: "info_id",
            allowNull: true
        },
        send_time: {
            type: model_Sequelize.DataTypes.DATE,
            field: "send_time",
            allowNull: true
        },
        status: {
            type: model_Sequelize.DataTypes.STRING(1),
            field: "status",
            allowNull: true
        }
    },
    {
        tableName: 'm_send_Info_history',
        timestamps: false,
    })
}