const model_Sequelize = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define("sw", {
        id: {
            type: model_Sequelize.DataTypes.INTEGER,
            allowNull: false, //非空
            autoIncrement: true, //自动递增
            primaryKey: true //主键
        },
        fl: {
            type: model_Sequelize.DataTypes.STRING(50),
            field: "fl",
            allowNull: false
        },
        mc: {
            type: model_Sequelize.DataTypes.STRING(500),
            field: "mc",
            allowNull: false    
        },
        ys: {
            type: model_Sequelize.DataTypes.STRING(500),
            field: "ys",
            allowNull: true
        },
        cz: {
            type: model_Sequelize.DataTypes.STRING(500),
            field: "cz",
            allowNull: true
        },
        dd: {
            type: model_Sequelize.DataTypes.STRING(500),
            field: "dd",
            allowNull: true
        },
        sj: {
            type: model_Sequelize.DataTypes.DATE,
            field: "sj",
            allowNull: true
        },
        dh: {
            type: model_Sequelize.DataTypes.STRING(500),
            field: "dh",
            allowNull: true
        },
        url: {
            type: model_Sequelize.DataTypes.STRING(500),
            field: "url",
            allowNull: true
        },
        nr: {
            type: model_Sequelize.DataTypes.TEXT,
            field: "nr",
            allowNull: true
        },
        member: {
            type: model_Sequelize.DataTypes.STRING(500),
            field: "member",
            allowNull: true
        },
        add_info_templateId: {
            type: model_Sequelize.DataTypes.INTEGER,
            field: "add_info_templateId",
            allowNull: true
        },
        zt: {
            type: model_Sequelize.DataTypes.STRING(500),
            field: "zt",
            allowNull: true
        }
    },
    {
        tableName: 'sw',
        timestamps: false,
    })
}