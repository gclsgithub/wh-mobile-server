const express = require('express')
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const path = require('path')

const app = express();

app.use('/mp', express.static(path.join(__dirname, 'public')))

app.use(cookieParser('session'));
app.use(session({
  saveUninitialized:false,               //是否将刚创建的session存到store中
  resave:false,                          //是否定期更新已经存到store中的session
  secret:"ergwe",                        //用于加密connect.sid(用于寻找session的id，存在于cookie中)
  rolling:true,                          //是否在用户每次请求时重置cookie(connect.sid)的生存时间
  cookie:{maxAge:30*60*1000}             //cookie（connect.sid）的生存时间，也是session的生存时间
}));

app.use(bodyParser.json())


// allow cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const user  = require('./route/user')
const auth  = require('./route/auth')
const maintance  = require('./route/maintance')
const wechat_fun  = require('./route/wechat_fun')
  
app.use('/admin/',auth)
app.use("/admin/user",user)
app.use("/admin/maintance",maintance)
app.use("/admin/wechatAu",wechat_fun)


app.listen(3000,(req,res)=>{
    console.log("service run")
})
