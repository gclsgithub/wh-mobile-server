<template>
  <div class="login">
    <el-container>
      <el-header>
        <div class="logo" align="center">
          <a href="http://cs.hytc.edu.cn/"
            >淮阴师范计算机学院<br />
            校园失物wechat申报平台
            <!-- <img src="../public/logo2.jpg" alt="" class="img" > -->
          </a>
        </div>
      </el-header>

      <el-main>
      
        <div align="right" >
          <button v-on:click="wechat_login">微信登录</button>
        
        </div>
      </el-main>
    </el-container>
    <OutLayoutFooter></OutLayoutFooter>
  </div>
</template>

<script>
import Vue from "vue";
import ElementUI from "element-ui";
import http from "vue-resource";
import OutLayoutFooter from "./OutLayout/Footer.vue";

Vue.use(ElementUI);
Vue.use(http);
export default {
  name: "login",
  components: {
    OutLayoutFooter,
  },
  data() {
    let check_username = (rule, value, callback) => {
      if (this.login_form.type == 0 && this.login_form.username == "") {
        return callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };
    let check_password = (rule, value, callback) => {
      if (this.login_form.type == 0 && this.login_form.password == "") {
        return callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };

    return {
      rule_login_form: {
        username: [{ validator: check_username, trigger: "blur" }],
        password: [{ validator: check_password, trigger: "blur" }],
      },
      activeName: "second_login",
      login_form: {
        ninecode: "",
        boatname: "",
        loginword: "",
        username: "",
        password: "",
        telphone: "",
        type: "",
      },
    };
  },
  methods: {
    wechat_login() {
      let get_url = this.$common.httpUrl + "/wechatAu/doLogin";
      this.$http.get(get_url).then((response) => {
        console.log("response", response);
        if (response.body.code != 200) {
          let sendUrl = response.body;
          window.location.href = sendUrl;
        }
      });
    },
    login_submit() {
      this.$refs["login_form"].validate((valid) => {
        if (valid) {
          let post_url = this.$common.httpUrl + "/login";
          let r = /^\d+$/;

          if (r.test(this.login_form.loginword) == true) {
            this.login_form.telphone = this.login_form.loginword;
          } else {
            this.login_form.username = this.login_form.loginword;
          }

          switch (this.activeName) {
            case "first_login":
              this.login_form.type = 1;
              break;
            case "second_login":
              this.login_form.type = r.test(this.login_form.loginword) ? 2 : 0;
              break;
            case "third_login":
              break;
            default:
              return;
          }

          console.log("this.login_form", this.login_form);

          this.$http.post(post_url, this.login_form).then((response) => {
            console.log("response", response);
            // let res = JSON.stringify(response.bodyText);
            let res = JSON.parse(response.bodyText);
            let code = res["code"];
            if (code == 200) {
              this.$message({
                showClose: true,
                message: "登陆成功",
                center: true,
                type: "success",
              });
              // let get_url = this.$common.httpUrl + "/wechatAu/doLogin";
              // this.$http.get(get_url).then((response) => {
              //   window.location.href = response.body;
              // });
              this.$router.replace({ path: "/maintance_list" });
            } else {
              this.$message({
                showClose: true,
                message: "登陆失败",
                center: true,
                type: "error",
              });
            }
          });
        } else {
          this.$message({
            showClose: true,
            message: "请输入",
            center: true,
            type: "error",
          });
        }
      });
    },
    handleClick() {
      // console.log(tab, event);
      // console.log(this.activeName);
      console.log("login_form", this.login_form);
    },
  },
};
</script>
