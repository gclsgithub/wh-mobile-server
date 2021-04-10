const express = require("express")
const redis = require('../service/myredis');
const multer = require("multer")
const bodyParser = require('body-parser');
var formidable = require("formidable");
const path = require("path")
var FormData = require('form-data');

require("../database/models/ref");
const { sendwehcatinfo, sendTemplateMsg, config, template_ids } = require("../service/wechat_link");

const wechat_config = config;
const SUBMIT_URL = "/dosubmit";
const SHOW_LIST_URL = "/list";
const DETAIL_URL = "/detail";


const { sequelize } = require("../db");

let ConnectPeople = require("../database/models/m_connect_people")(sequelize)
let BadType = require("../database/models/m_bad_type")(sequelize)
let Maintenance = require("../database/models/m_maintenance")(sequelize)
let sw = require("../database/models/sw")(sequelize)
let Porduct_type = require("../database/models/m_porduct_type")(sequelize)

const maintance = express.Router()

// 设置上传的目录文件夹
const upload = multer({ dest: __dirname + '../public/upload' })

/**
 * 获取一览参数
 */
maintance.post(SHOW_LIST_URL, bodyParser.urlencoded({ extend: true }), (req, res) => {
    const { limit, offset } = req.body
    let login_id = req.session.user.id

    if (limit == null || offset == null) {
        res.json({
            code: "500",
            "message": "输入参数错误"
        });
        return
    }

    let condition = {
        offset: parseInt(offset),
        limit: parseInt(limit)
    };

    sw.findAndCountAll(condition).then(maintances => {
        res.json({
            code: "200",
            data: {
                count: maintances.count,
                current_count: maintances.rows.length,
                maintanceList: maintances.rows
            }
        });
    });
})

/**
 * 获取一览参数
 */
maintance.post(DETAIL_URL, bodyParser.urlencoded({ extend: true }), (req, res) => {
    const { maintance_id } = req.body

    if (maintance_id == null) {
        res.json({
            code: "500",
            "message": "输入参数错误"
        });
        return
    }

    let condition = {
        where: {
            id: maintance_id
        }
    };
    Maintenance.findOne(condition).then((item) => {
        res.json({
            code: "200",
            data: {
                maintance_detail: item
            }
        });
    });

})

/**
 * 上传维修信息
 * @param porduct_type_id  产品类别
 * @param porduct_type_desp 产品描述
 * @param bad_type_category  故障列别1
 * @param bad_type_major_subject 故障列别2
 * @param serveice_time 维修时间
 * @param product_type 产品类别
 * @param product_seriable_number 产品型号
 * @param bad_images 故障图片
 * @param descp 故障描述
 * @param maintenance_type 维修分类
 * @param express_code 快递单号
 * @param connect_peoples 联系人姓名
 * @param     connect_name 联系人姓名
 * @param     connect_phone 联系人电话
 * @param     connect_address 联系人电话
 */
maintance.post(SUBMIT_URL, upload.any(), (req, res) => {


    let uploadfiles = req.files;

    let data = req.body.data;

    var filepathStr = "";

    uploadfiles.forEach(file => {
        console.log(file.path);
        filepathStr = filepathStr + file.path + ";";
    })

    let postData = JSON.parse(req.body.data)

    const { fl, mc, ys, cz, dd, sj, express_code, nr,connect_peoples, maintenance_type } = postData

    if (fl == null
        || mc == null
        || maintenance_type == null
        || cz == null
        || ys == null
        || dd == null
        || sj == null) {
        res.json({
            code: "500",
            "message": "有信息未填写"
        });
        return
    }

    let member = "";
    let dh = "";
    if (maintenance_type == 1 || "1".equal(maintenance_type)) {
        member = connect_peoples[0].connect_name;
        dh = connect_peoples[0].connect_phone;
    }

    var zt = "作成";
    console.log("data has been input");


    let regist_connect_info ={
        fl:fl,
        mc:mc,
        ys:ys,
        cz:cz,
        dd:dd,
        sj:sj,
        dh:dh,
        url:filepathStr,
        nr:nr,
        member:member,
        zt:zt
    };
    let now_time = formatDate(new Date());

    console.log("begin to insert");
    sw.create(regist_connect_info).then((maintance) => {
        
        var reqData = {
            username: {
                value: "尊敬的客户",
                color: "#173177"
            },
            product_name: {
                value: maintance.mc,
                color: '#1d1d1d'
            },
            process_state: {
                value: '申请成功',
                color: '#1d1d1d'
            },
            process_date: {
                value: now_time,
                color: '#1d1d1d'
            },
            maintance_id: {
                value: maintance.id,
                color: '#173177'
            },
            ps: {
                value: '请您保持⼿手机畅通，稍后会有服务⼈人员与您联系~~',
                color: '#173177'
            }
        };

        let template_id = 'o6swY447FaJRCAzhDfJO7z4zAEzv5oPVoM7tjDWswiU';

        let daga = {};
        daga.reqData = reqData;
        daga.template_id = template_id;

        sendwehcatinfo(daga, redis, res);

        //消息通知
        res.json({
            code: "200",
            message: "创建成功"
        });

    });
})

var formatDate = function (date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = date.getSeconds();
    second = minute < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};
module.exports = maintance
