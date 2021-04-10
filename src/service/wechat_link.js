const fs = require('fs');
const path = require('path');
const sha1 = require('node-sha1');
const request = require('request');
const urlencode = require('urlencode');

const { sequelize } = require("../db");
let User = require("../database/models/m_user")(sequelize)


/**
 * 微信配置
 */
// const config = {
// 	token: '123456',
// 	appid: 'wxf1081c1cc9dba801',
// 	secret: '3972b3add2b741660865f7438a781df3',
// 	grant_type: 'client_credential'
// };
const config = {
	token: '123456',
	appid: 'wxf1081c1cc9dba801',
	secret: '3972b3add2b741660865f7438a781df3',
	grant_type: 'client_credential'
};

const template_ids = [
	{ id: "JersX8xVatNOIsQh9SzHZEEusR5LTkx1LPuj9qnNsS8" }
]

const call_back_url = "http://hytc.natapp1.cc/admin/wechatAu/code";

var util = require('util');

let getWechatLinkUrl = () => {

	const appid = config.appid;
	const redirect_uri = urlencode(call_back_url); //这里的url需要转为加密格式，它的作用是访问微信网页鉴权接口成功后微信会回调这个地址，并把code参数带在回调地址中
	const scope = 'snsapi_userinfo';

	const url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid
		+ '&redirect_uri=' + redirect_uri
		+ '&response_type=code&scope=' + scope
		+ '&state=STATE&connect_redirect=1#wechat_redirect';

	console.log(url);

	return url;
}

let auth_wechat_link = (req, res) => {
	const token = config.token;
	const signature = req.query.signature;
	const nonce = req.query.nonce;
	const timestamp = req.query.timestamp;

	const str = [token, timestamp, nonce].sort().join('');
	const sha = sha1(str);

	console.log(token);
	console.log(signature);
	console.log(nonce);
	console.log(timestamp);
	console.log(str);
	console.log(sha);



	if (sha === signature) {
		const echostr = req.query.echostr;
		return echostr;
	} else {
		return "error";
	}
}

let send_wechat_info = (templated_id) => {

}

/**
 * 获取openid
 * @param  { string } code [调用获取openid的接口需要code参数]
 */
function getOpenId(code, redis) {
	const appid = config.appid;
	const secret = config.secret;

	const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`;

	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			const jsonbody = JSON.parse(body);
			const openid = JSON.parse(body).openid;
			//获取openid成功后调用getAccessToken
			getAccessToken(openid, redis);
		}
	});
}

/**
 * 获取access_token
 *  @param  { string } openid [发送模板消息的接口需要用到openid参数]
 */
function dologinAccesstoken(code, redis) {
	const appid = config.appid;
	const secret = config.secret;
	const grant_type = config.grant_type;

	const call_open_id_url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`;

	console.log("A1111");
	request(call_open_id_url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			const jsonbody = JSON.parse(body);
			const openid = JSON.parse(body).openid;

			const access_url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=${grant_type}&appid=${appid}&secret=${secret}`;

			request(access_url, function (error, response, body) {

				if (!error && response.statusCode == 200) {

					const access_token = JSON.parse(body).access_token;

					const appid = config.appid;
					const secret = config.secret;
					const grant_type = config.grant_type;

					const url = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access_token}&openid=${openid}&lang=zh_CN`;

					request(url, function (error, response, body2) {

						if (!error && response.statusCode == 200) {

							const wechat_user_info = JSON.parse(body2);

							wechat_user_info.access_token = access_token;
							//保存accessToken
							// sendTemplateMsg(openid, access_token); //获取access_token成功后调用发送模板消息的方法

							const wechat_username = wechat_user_info.nickname;

							if (wechat_username != null) {
								let condition =
								{
									where: {
										user_name: wechat_username
									}
								};
								User.findOne(condition)
									.then((finduser) => {
										if (finduser != null) {
											//找到用户，更新id
											let condition = {
												where: {
													id: finduser.id
												}
											};
											let upwehcatId = {
												wechat_id: wechat_user_info.openid
											};
											wechat_user_info.openid = openid;
											console.log("find User");
											User.update(upwehcatId, condition).then((user_info) => {
												const wechat_login_info_str = JSON.stringify(wechat_user_info);
												redis.setKey('wecht_login', wechat_login_info_str);
												console.log("update SUCCESS");
											});
										} else {
											//找到用户，更新插入数据
											let resit_userInfo = {
												wechat_id: wechat_user_info.openid,
												user_name: wechat_user_info.nickname,
												phone: 111111111,
												create_user: wechat_user_info.nickname,
												update_user: wechat_user_info.nickname
											}
											wechat_user_info.openid = openid
											const wechat_login_info_str = JSON.stringify(wechat_user_info);
											User.create(resit_userInfo).then((user_info) => {
												redis.setKey('wecht_login', wechat_login_info_str);
                                                                                                });
											}
										});
							} else {
								console.log('微信用户信息获取失');
							}
						} else {
							console.log('微信信息查询失败');
						}
					});
					// sendTemplateMsg(openid, access_token); //获取access_token成功后调用发送模板消息的方法
				} else {
					throw 'update access_token error';
				}
			});
		}
	});

}

let sendwehcatinfo = (data, redis,res) => {
	const appid = config.appid;
	const secret = config.secret;
	const grant_type = config.grant_type;

	const access_url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=${grant_type}&appid=${appid}&secret=${secret}`;

	request(access_url, function (error, response, body) {

		if (!error && response.statusCode == 200) {

			const access_token = JSON.parse(body).access_token;

			let wechat_info = redis.getKey('wecht_login');

			wechat_info.then((winfo_str) => {
				let winfo = JSON.parse(winfo_str);

				sendTemplateMsg(winfo.openid, access_token, data.template_id, data.reqData);
			})
		}
	});
}

/**
 * 发送模板消息
 * @param  { string } openid [发送模板消息的接口需要用到openid参数]
 * @param  { string } access_token [发送模板消息的接口需要用到access_token参数]
 */

function sendTemplateMsg(openid, access_token, template_id, reqData) {

	const myurl = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`; //发送模板消息的接口

	const requestData = { //发送模板消息的数据
		touser: openid,
		template_id: template_id,
		// url: 'http://weixin.qq.com/download',
		data: reqData
	};
	request({
		url: myurl,
		method: 'post',
		//发送JSON数据
		json: requestData,
	}, (error, response, body) => {
		if (!error && response.statusCode == 200) {
			console.log('模板消息推送成功');
		}
	});
}


module.exports = { getWechatLinkUrl, auth_wechat_link, dologinAccesstoken, sendwehcatinfo, sendTemplateMsg, template_ids, config }
