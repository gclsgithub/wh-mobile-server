const model_Sequelize = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define("m_maintenance", {
        id: {
            type: model_Sequelize.DataTypes.INTEGER,
            allowNull: false, //非空
            autoIncrement: true, //自动递增
            primaryKey: true //主键
        },
        product_type_id: {
            type: model_Sequelize.DataTypes.INTEGER,
            field: "product_type_id",
            allowNull: false
        },
        product_name: {
            type: model_Sequelize.DataTypes.STRING(50),
            field: "product_name",
            allowNull: false    
        },
        type: {
            type: model_Sequelize.DataTypes.STRING(1),
            field: "type",
            allowNull: true
        },
        bad_type: {
            type: model_Sequelize.DataTypes.INTEGER,
            field: "bad_type",
            allowNull: true
        },
        serveice_time: {
            type: model_Sequelize.DataTypes.DATE,
            field: "serveice_time",
            allowNull: true
        },
        conncet_people_id: {
            type: model_Sequelize.DataTypes.INTEGER,
            field: "conncet_people_id",
            allowNull: true
        },
        product_type: {
            type: model_Sequelize.DataTypes.STRING(50),
            field: "product_type",
            allowNull: true
        },
        product_seriable_number: {
            type: model_Sequelize.DataTypes.STRING(50),
            field: "product_seriable_number",
            allowNull: true
        },
        maintenance_pic: {
            type: model_Sequelize.DataTypes.TEXT,
            field: "maintenance_pic",
            allowNull: true
        },
        descp: {
            type: model_Sequelize.DataTypes.TEXT,
            field: "descp",
            allowNull: true
        },
        express_number: {
            type: model_Sequelize.DataTypes.STRING(15),
            field: "express_number",
            allowNull: true
        },
        add_info_templateId: {
            type: model_Sequelize.DataTypes.INTEGER,
            field: "add_info_templateId",
            allowNull: true
        },
        update_info_templateId: {
            type: model_Sequelize.DataTypes.INTEGER,
            field: "update_info_templateId",
            allowNull: true
        },
        finish_info_templateId: {
            type: model_Sequelize.DataTypes.INTEGER,
            field: "finish_info_templateId",
            allowNull: true
        },
        maintenance_status: {
            type: model_Sequelize.DataTypes.INTEGER,
            field: "maintenance_status",
            allowNull: true,
            defaultValue:'0'
        },
        own_user_id: {
            type: model_Sequelize.DataTypes.INTEGER,
            field: "own_user_id",
            allowNull: true,
        },
        create_time: {
            type: model_Sequelize.DataTypes.DATE,
            field: "create_time",
            allowNull: true,
            defaultValue:model_Sequelize.NOW
        },
        create_user: {
            type: model_Sequelize.DataTypes.STRING(50),
            field: "create_user",
            allowNull: true
        },
        update_time: {
            type: model_Sequelize.DataTypes.DATE,
            field: "update_time",
            allowNull: true,
            defaultValue:model_Sequelize.NOW
        },
        update_user: {
            type: model_Sequelize.DataTypes.STRING(50),
            field: "update_user",
            allowNull: true
        }
    },
    {
        tableName: 'm_maintenance',
        timestamps: false,
    })
}