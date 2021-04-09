const model_Sequelize = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define("m_user", {
        id: {
            type: model_Sequelize.DataTypes.INTEGER,
            allowNull: false, //非空
            autoIncrement: true, //自动递增
            primaryKey: true //主键
        },
        user_name: {
            type: model_Sequelize.DataTypes.STRING(50),
            field: "user_name",
            allowNull: true
        },
        email: {
            type: model_Sequelize.DataTypes.STRING(50),
            field: "email",
            allowNull: true
        },
        wechat_id: {
            type: model_Sequelize.DataTypes.STRING(100),
            field: "wechat_id",
            allowNull: true
        },
        nine_code: {
            type: model_Sequelize.DataTypes.STRING(9),
            field: "nine_code",
            allowNull: true
        },
        phone: {
            type: model_Sequelize.DataTypes.STRING(15),
            field: "phone",
            allowNull: true
        },
        boat_name: {
            type: model_Sequelize.DataTypes.STRING(50),
            field: "boat_name",
            allowNull: true
        },
        role: {
            type: model_Sequelize.DataTypes.STRING(1),
            field: "role",
            allowNull: true
        },
        info_flag: {
            type: model_Sequelize.DataTypes.STRING(1),
            field: "info_flag",
            allowNull: true
        },
        point: {
            type: model_Sequelize.DataTypes.STRING(15),
            field: "point",
            allowNull: true
        },
        company_name: {
            type: model_Sequelize.DataTypes.STRING(50),
            field: "company_name",
            allowNull: true
        },
        contact_people_id: {
            type: model_Sequelize.DataTypes.INTEGER,
            field: "contact_people_id",
            allowNull: true
        },
        contact_phone: {
            type: model_Sequelize.DataTypes.STRING(15),
            field: "contact_phone",
            allowNull: true
        },
        contact_people_name: {
            type: model_Sequelize.DataTypes.STRING(50),
            field: "contact_people_name",
            allowNull: true
        },
        pass_word: {
            type: model_Sequelize.DataTypes.STRING(250),
            field: "pass_word",
            allowNull: true
        },
        last_login_dt: {
            type: model_Sequelize.DataTypes.DATE,
            field: "last_login_dt",
            allowNull: true
        },
        fail_count: {
            type: model_Sequelize.DataTypes.INTEGER,
            field: "fail_count",
            allowNull: true
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
        tableName: 'm_user',
        timestamps: false,
    })
}