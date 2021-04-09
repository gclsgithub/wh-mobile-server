<template>
  <div class="forget_pwd">
    <el-container>
      <el-header>
        <h1 align="center">找回密码</h1>
      </el-header>
      <el-main>
        <el-form ref="form" :model="form">

          <el-row>
            <el-col>
              <el-form-item label="邮箱" >
                <el-input
                  placeholder="请输入邮箱"
                  v-model="form.mail"
                  maxlength="50"
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
            <el-button @click="submit" type='primary'>申请找回</el-button>
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
      form: {
        mail:'',
      },

    };
  },
  methods: {
    submit(){
      console.log(this.form);

      let get_url = this.$common.httpUrl + "/forgetpwd";

      let params =  this.form ;

      // console.log(get_url,params);
      console.log('url>>>>',get_url);
      
      
      this.$http.post(get_url, params).then((response) => {
        console.log("response", response);
        let res = JSON.parse(response.bodyText);
        let code = res["code"];
        if (code == 200) {
          this.$message({
            showClose: true,
            message: "找回成功",
            center: true,
            type: "success",
          });
          this.$router.replace({ path: "/" });
        } else {
          this.$message({
            showClose: true,
            message: "找回失败",
            center: true,
            type: "error",
          });
        }
      });

    }
  },
};
</script>
