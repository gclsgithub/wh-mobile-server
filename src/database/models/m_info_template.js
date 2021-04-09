const model_Sequelize = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define("m_info_template", {
        id: {
            type: model_Sequelize.DataTypes.INTEGER,
            allowNull: false, //非空
            autoIncrement: true, //自动递增
            primaryKey: true //主键
        },
        content: {
            type: model_Sequelize.DataTypes.TEXT,
            field: "content",
            allowNull: true
        },
        type: {
            type: model_Sequelize.DataTypes.DATE,
            field: "type",
            allowNull: true
        },
        title: {
            type: model_Sequelize.DataTypes.STRING(50),
            field: "title",
            allowNull: true
        }
    },
    {
        tableName: 'm_info_template',
        timestamps: false,
    })
}