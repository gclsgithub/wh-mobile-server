const express = require("express")
const bodyParser = require('body-parser');
const redis = require('../service/myredis');


const { auth_wechat_link, getWechatLinkUrl, dologinAccesstoken,getOpenId } = require("../service/wechat_link");

const ROOT_SLASH = "/mp";
const WECHAT_LOGIN_SLASH = "/code";
const WECHAT_LOGIN_URL_SLASH = "/doLogin";
const wechat_fun = express.Router()


wechat_fun.get(ROOT_SLASH, (req, res) => {
    const outStr = auth_wechat_link(req, res)
    console.log(outStr);
    res.send(outStr);
});

wechat_fun.get(WECHAT_LOGIN_URL_SLASH, (req, res) => {
    const outStr = getWechatLinkUrl(req, res)
    res.send(outStr);
});

wechat_fun.get(WECHAT_LOGIN_SLASH, (req, res) => {
    //微信回调这个接口后会把code参数带过来
    console.log("aaa");
    const code = req.query.code; 

    console.log("code:" + code);

    //把code传入getOpenId方法
    dologinAccesstoken(code,redis); 

    console.log("Login Success!!!");
    res.redirect("http://marinelite.cn/maintance_list");
})

module.exports = wechat_fun



