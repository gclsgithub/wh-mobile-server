const express = require("express")
const bodyParser = require('body-parser');
const { Op } = require("sequelize");
const redis = require('../service/myredis');
const nodemailer = require('nodemailer');

require("../database/models/ref");

const { getWechatLinkUrl } = require("../service/wechat_link");

const { USER_EXIT, FORGET_MAIL_INFO_ERROR, FORGET_INFO_ERROR, NOT_IN_USERNAME_OR_PASS, NOT_IN_TEL_OR_PASS, NOT_IN_BOAT_OR_PASS, USER_NOT_EXIT, REGIST_INFO_ERROR } = require("../whconst/wh_const")

const { sequelize } = require("../db");

let User = require("../database/models/m_user")(sequelize)
var crypto = require("crypto");

const auth = express.Router()



//////////////定数
const LOGIN_URL = "login";
const REGIST_URL = "regist";
const FORGETPWD_URL = "forgetpwd";

const TEN_TXT = "txt";

const LOGIN_SLASH = "/login";
const LOGOUT_SLASH = "/logout";
const REGIST_SLASH = "/regist";
const FORGETPWD_SLASH = "/forgetpwd";
const WECHAT_SLASH = "/wechatAu";
const RELOADPWD_URL = "/reloadpwd";

auth.use((req, res, next) => {
    const req_url = req.url;

    //判断请求url
    if (!req_url.startsWith(LOGIN_SLASH) &&
        !req_url.startsWith(REGIST_SLASH) &&
        !req_url.startsWith(FORGETPWD_SLASH) &&
        !req_url.startsWith(RELOADPWD_URL) &&
        !req_url.startsWith(WECHAT_SLASH) &&
        !req_url.endsWith(TEN_TXT)) {
        //从session 中获取user,如果user对象为空，则需要登陆么。否则继续
        let myloadsession = redis.getKey('login_user_str');//获取key
        let wechat_info = redis.getKey('wecht_login');//获取key
	console.log("in auth");
        myloadsession.then(login_user_str => {
            if (login_user_str == null) {
                wechat_info.then(login_wechat_info => {
                    if (login_wechat_info == null) {
                        res.json({
                            code: "500",
                            message: "用户未登陆"
                        });
                        return
                    } else {
                        let wechat_user = JSON.parse(login_wechat_info);
                        let condition =
                        {
                            where: {
                                wechat_id: wechat_user.openid
                            }
                        };

                        User.findOne(condition).then((find_user) => {
                            login_user = {
                                id: find_user.id,
                                userName: find_user.user_name
                            };
                            console.log("id===="+login_user.id);
			    req.session.user = login_user;
                            next();
                        });

                    }
                })
            } else {
                let login_user = JSON.parse(login_user_str);
                req.session.user = login_user;
                next();
            }
        })
    } else {
        next();
    }
})

auth.post(LOGOUT_SLASH, bodyParser.urlencoded({ extend: true }), (req, res) => {
    const { userid } = req.body

    if (String(req.session.user.id) == userid) {
        //清除登陆信息
        redis.clearKey('login_user_str', null).then(() => {
                res.json({
                    code: "200",
                    message: "退出成功"
		});
            }).catch((error) => {
	       redis.clearKey('wecht_login', null).then(() => {
                res.json({
                    code: "200",
                    message: "退出成功"
                }).catch((error) => {
                   res.json({
                    code: "500",
                    message: "退出失?",
                    error: error
                  });
              });
            })
        });

    } else {
        res.json({
            code: "500",
            message: "注销用户和登陆用户不一致"
        });
    }

})

/**
 * @param username 用户名
 * @param type 0--用户名登陆  1--9位码➕船名 2--手机号码登录
 * @param telphone 手机号码登录
 * @param ninecode 9位码
 * @param boatname 船名
 * @param password
 * login
 */
auth.post(LOGIN_SLASH, bodyParser.urlencoded({ extend: true }), (req, res) => {
    const { type, username, password, telphone, ninecode, boatname } = req.body

    let sha512 = crypto.createHash('sha512');
    sha512.update(password);
    let encode_password = sha512.digest("hex");
    let username_str = username

    let type_int = parseInt(type)

    // 用户名登陆
    if (type_int == 0) {
        if (username_str == null || password == null) {
            res.json({
                code: "500",
                message: NOT_IN_USERNAME_OR_PASS
            });
        } else {
            let condition =
            {
                where: {
                    user_name: username_str,
                    pass_word: encode_password
                }
            };
            User.findOne(condition)
                .then((finduser) => {
                    console.log(finduser);
                    if (finduser == null) {
                        res.json({
                            code: "500",
                            message: USER_NOT_EXIT
                        });
                        return;
                    }

                    login_user = {
                        id: finduser.id,
                        userName: finduser.user_name
                    };
                    //设置
                    let login_user_str = JSON.stringify(login_user);
                    redis.setKey('login_user_str', login_user_str).then(() => {
                        res.json({
                            code: "200",
                            user_id: finduser.id
                        });
                    }).catch((error) => {
                        res.json({
                            code: "500",
                            message: "REDIS ERROR"
                        });
                    })
                });
        }
    }

    // 9位码➕船名
    if (type_int == 1) {
        if (boatname == null || ninecode == null || password == null) {
            res.json({
                code: "500",
                message: NOT_IN_BOAT_OR_PASS
            });
        } else {
            (async () => {
                let find_users = await User.findAll(
                    {
                        where: {
                            pass_word: encode_password
                        }
                    });

                if (find_users == null) {
                    res.json({
                        code: "500",
                        message: USER_NOT_EXIT
                    });
                    return;
                }

                find_users.forEach(user => {
                    var boatStr = user.nine_code + user.boat_name;
                    if (boatStr == ninecode + boatname) {
                        login_user = {
                            id: user.id,
                            userName: user.user_name
                        };

                        //设置
                        let login_user_str = JSON.stringify(login_user);
                        redis.setKey('login_user_str', login_user_str).then(() => {
                            res.json({
                                code: "200",
                                user_id: user.id
                            });
                            return;
                        }).catch((error) => {
                            res.json({
                                code: "500",
                                message: "REDIS ERROR"
                            });
                        })
                    }
                })
            })();
        }
    }

    // 手机号码登录
    if (type_int == 2) {
        if (telphone == null || password == null) {
            res.json({
                message: NOT_IN_TEL_OR_PASS
            });
        } else {
            (async () => {
                let find_users = await User.findOne(
                    {
                        where: {
                            'phone': telphone,
                            'pass_word': encode_password
                        }
                    }
                );

                if (find_users == null) {
                    res.json({
                        code: "500",
                        message: USER_NOT_EXIT
                    });
                    return;
                }

                login_user = {
                    id: find_users.id,
                    userName: find_users.user_name
                };

                //设置
                let login_user_str = JSON.stringify(login_user);
                redis.setKey('login_user_str', login_user_str).then(() => {
                    res.json({
                        code: "200",
                        user_id: find_users.id
                    });
                    return;
                }).catch((error) => {
                    res.json({
                        code: "500",
                        message: "REDIS ERROR"
                    });
                })
            })();
        }
    }
})

/**
 * 注册
 * must
 * @param telphone  手机号码
 * @param username  用户名
 * @param mailaddress 邮件地址
 * @param password 注册密码
 * @param revieveflag 接受微信消息推送flag
 * @param role 角色名 0--经销商 1--售后  2.--船东  3--船厂  4--其他
 *                   0.经销商 ,1.售后  2.船东 ,3.船厂 ,4.其他
 * 
 * optional
 * @param nineCode  9位码
 * @param boatName  船名
 * @param companyName  公司名
 * @param contactPeopleName  联系人名
 * @param contactPeoplePhone  联系人手机
 * regist
 */
auth.post(REGIST_SLASH, bodyParser.urlencoded({ extend: true }), (req, res) => {

    let sha512 = crypto.createHash('sha512');

    // must
    const { telphone, username, mailaddress, revieveflag, password, role } = req.body
    const likeUserName = '%' + username + '%';
    const checkCondition = {
        where: {
            [Op.or]: [
                {
                    user_name: {
                        [Op.like]: likeUserName
                    }
                },
                {
                    phone: {
                        [Op.like]: telphone
                    }
                }

            ]

        }
    }
    User.findAll(checkCondition).then(item => {
        if (item != null && item.length > 0) {
            res.json({
                code: "500",
                message: USER_EXIT
            });
            return;
        }
    })

    if (telphone == null ||
        username == null ||
        mailaddress == null ||
        revieveflag == null ||
        password == null ||
        role == null) {
        res.json({
            code: "500",
            message: REGIST_INFO_ERROR
        });
        return;
    }

    //optional
    const { nineCode, boatName, companyName, contactPeopleName, contactPeoplePhone } = req.body


    let updatepass = sha512.update(password)
    let encode_password = sha512.digest("hex")


    let resit_userInfo = {
        phone: telphone,
        user_name: username,
        email: mailaddress,
        info_flag: revieveflag,
        pass_word: encode_password,
        role: role,
        create_user: username,
        update_user: username
    }

    //经销商   //船厂
    if (parseInt(role) == 0 || parseInt(role) == 3) {
        if (companyName == null ||
            contactPeopleName == null ||
            contactPeoplePhone == null) {
            res.json({
                code: "500",
                message: REGIST_INFO_ERROR
            });
            return;
        }


        resit_userInfo.company_name = companyName
        resit_userInfo.contact_people_name = contactPeopleName
        resit_userInfo.contact_phone = contactPeoplePhone
    }

    //售后
    if (parseInt(role) == 1) {

    }

    //船东
    if (parseInt(role) == 2) {
        if (nineCode == null ||
            boatName == null) {
            res.json({
                code: "500",
                message: REGIST_INFO_ERROR
            });
            return;
        }
        resit_userInfo.nine_code = nineCode
        resit_userInfo.boat_name = boatName
    }

    //其他
    if (parseInt(role) == 4) {

    }

    User.create(resit_userInfo).then(
        (info) => {
            res.json({
                code: "200"
            });
        });

})

/**
 * @param userid 用户id
 * @param password 用户密码
 * forgetpwd
 */
auth.post(RELOADPWD_URL, bodyParser.urlencoded({ extend: true }), (req, res) => {

    let sha512 = crypto.createHash('sha512');

    // must
    const { userid, password } = req.body


    if (userid == null || password == null) {
        res.json({
            code: "500",
            message: FORGET_INFO_ERROR
        });
        return;
    }
    let updatepass = sha512.update(password)
    let encode_password = sha512.digest("hex")

    let condition =
    {
        where: {
            id: userid
        }
    };

    let uppwd = {
        pass_word: encode_password
    };
    User.update(uppwd, condition);

    res.json({
        code: "200"
    });
})

/**
 * @param mail 邮箱地址
 * forgetpwd
 */
auth.post(FORGETPWD_SLASH, bodyParser.urlencoded({ extend: true }), (req, res) => {
    // must
    const { mail } = req.body

    if (mail == null) {
        res.json({
            code: "500",
            message: FORGET_INFO_ERROR
        });
        return;
    }

    // let code = sendmail(mail);

    if (code == 200) {
        res.json({
            code: "200"
        });
    } else {
        res.json({
            code: "500",
            message: FORGET_MAIL_INFO_ERROR
        });
    }
})

/**
 * get url 
 */
auth.post(WECHAT_SLASH, (req, res) => {

    let wechat_call_url = getWechatLinkUrl()
    res.json({
        code: "200",
        return: wechat_call_url
    });
})


function sendmail(mail) {
    'use strict';

    let transporter = nodemailer.createTransport({
        // host: 'smtp.ethereal.email',
        service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
        port: 465, // SMTP 端口
        secureConnection: true, // 使用了 SSL
        auth: {
            user: 'xxxxxx@qq.com',
            // 这里密码不是qq密码，是你设置的smtp授权码
            pass: 'xxxxxx',
        }
    });

    let mailOptions = {
        from: '"赛洋科技" <xxxxx@qq.com>', // sender address
        to: 'xxxxxxxx@163.com', // list of receivers
        subject: 'Hello', // Subject line
        // 发送text或者html格式
        // text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
    });
}

module.exports = auth
