<template>
  <div class="reset_pwd">
    <el-container>
      <el-header>
        <h1 align="center">重置密码</h1>
      </el-header>
      <el-main>
        <el-form ref="reset_form" :model="reset_form">

          <el-row>
            <el-col>
              <el-form-item label="新密码" >
                <el-input
                  placeholder="请输入新密码"
                  v-model="reset_form.password"
                  maxlength="50"
                  show-password
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="确认新密码" >
                <el-input
                  placeholder="确认新密码"
                  v-model="reset_form.repassword"
                  maxlength="50"
                  show-password
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </el-main>

      <el-footer>
        <el-row>
          <el-col align="center">
            <el-button @click="$router.back(1)">返回</el-button>
            <el-button @click="submit" type='primary'>提交</el-button>
          </el-col>
        </el-row>
      </el-footer>


    </el-container>
    <OutLayoutFooter></OutLayoutFooter>
  </div>
</template>

<script>
import Vue from "vue";
import ElementUI from "element-ui";
import http from "vue-resource";
import OutLayoutFooter from './OutLayout/Footer.vue'

Vue.use(ElementUI);
Vue.use(http);
export default {
  name: "resetpwd",
  components:{
    OutLayoutFooter
  },
  data() {


    return {
      reset_form: {
        userid:'2',
        password:'',
        repassword:'',
      },

    };
  },
  methods: {
    submit(){

      let get_url = this.$common.httpUrl + "/reloadpwd";

      let params =  this.reset_form ;

      console.log(get_url,params);
      
      this.$http.post(get_url, params).then((response) => {
        console.log("response", response);
        let res = JSON.parse(response.bodyText);
        let code = res["code"];
        if (code == 200) {
          this.$message({
            showClose: true,
            message: "重置成功",
            center: true,
            type: "success",
          });
          this.$router.replace({ path: "/" });
        } else {
          this.$message({
            showClose: true,
            message: "重置失败",
            center: true,
            type: "error",
          });
        }
      });
      
    }
  },
};
</script>
