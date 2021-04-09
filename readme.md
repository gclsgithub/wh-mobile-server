# 1.需要安装的包
> 编译执行的包
* npm install -D nodemon

> web关联的包
> ejs该模块是一个渲染引擎。 但是前台使用VUE.js.确认后决定是否使用ejs
* npm install -D express 
* npm install -D body-parser
* npm install -D express-session
* npm install -D cookie-parser
* npm install -D multer
* npm install -D cors
* npm install -D redis
* npm install -D ejs [TODO]


> db相关的包    
* npm install --save mysql2
* npm install --save sequelize
* npm install --save sequelize-client

> VUE关联的安装
* [TODO]

# 2.models做成
``` 
sequelize model:generate --name m_porduct_type --attributes name:string,age:integer
```
# 3.执行

在当前环境下运行：  npm start

在当前环境下运行DEBUG： npm run start


# 4.请求地址
                            code         test
* 4.1 post /login            ok           ok
> 进行登陆认证

* 4.2post /regist            ok           -
> 进行登陆认证

* 4.3 get /forgetpwd         ok          
> 获取忘记密码url

* 4.4 post /reloadpwd         ok          -
> 重置密码

* 4.5 post /maintance/dosubmit
> 提交维修信息,提交之后wechat 更新推送

* 4.6 post /maintance/{id}
> 查询维修单详细

* 4.7post /maintance/list
> 查询维修单一览


