<template>
  <div class="regist_page">

            
    <el-container>
      <el-header>
        <h1 align="center">注册</h1>
      </el-header>

      <el-main>

        <el-form ref="regist_form" :model="regist_form" >
          <el-row>
            <el-col>
              <el-form-item label="手机号码" >
                <el-input
                  placeholder="请输入手机号"
                  v-model="regist_form.telphone"
                  maxlength="15"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="用户名" >
                <el-input
                  placeholder="请输入用户名"
                  v-model="regist_form.username"
                  maxlength="50"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="密码" >
                <el-input
                  placeholder="请输入密码"
                  v-model="regist_form.password"
                  maxlength="50"
                  show-password
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="确认密码" >
                <el-input
                  placeholder="请再输入密码"
                  v-model="regist_form.repassword"
                  maxlength="50"
                  show-password
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="邮箱地址" >
                <el-input
                  placeholder="请输入邮箱地址"
                  v-model="regist_form.mailaddress"
                  maxlength="50"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="推送" >
                <el-checkbox v-model="regist_form.revieveflag">接受微信消息</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>


          <el-row>
            <el-col>
              <el-form-item label="身份" >
                <el-select
                  v-model="regist_form.role"
                  clearable
                  style="width: 200px"
                >
                  <el-option
                    v-for="item in transform_list.roles"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>




          <el-row v-if="regist_form.role == 2">
            <el-col>
              <el-form-item label="9位码" >
                <el-input 
                  placeholder="请输入9位码" 
                  v-model="regist_form.nineCode" 
                  maxlength="9"
                  
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="regist_form.role == 2">
            <el-col>
              <el-form-item label="船名" >
                <el-input 
                  placeholder="请输入船名" 
                  v-model="regist_form.boatName" 
                  maxlength="50"
                  
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  v-if="regist_form.role == 0 | regist_form.role == 3">
            <el-col>
              <el-form-item label="公司名" >
                <el-input 
                  placeholder="请输入公司名" 
                  v-model="regist_form.companyName" 
                  maxlength="50"
                 
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="regist_form.role == 0 | regist_form.role == 3">
            <el-col>
              <el-form-item label="联系人名" >
                <el-input 
                  placeholder="请输入联系人名" 
                  v-model="regist_form.contactPeopleId" 
                  maxlength="50"
                  
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="regist_form.role == 0 | regist_form.role == 3">
            <el-col>
              <el-form-item label="联系人手机" >
                <el-input 
                  placeholder="请输入联系人手机" 
                  v-model="regist_form.contactPeoplePhone" 
                  maxlength="15"
                  
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
            <el-button type="success" @click="submit"> 提交 </el-button>
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
  name: "register",
  components:{
    OutLayoutFooter
  },
  data() {
    return {
      regist_form: {
        telphone:'',			          //手机号码
        username:'',                //用户名
        password:'',                //密码
        repassword:'',              //确认密码
        mailaddress:'',             //邮件地址
        revieveflag:'',             //接受微信消息推送flag
        role:'',                    //角色名  0.经销商 ,1.售后 ,2.船东 ,3.船厂 ,4.其他
        nineCode:'',                //九位码
        boatName:'',                //船名
        companyName:'',             //公司名
        contactPeopleId:'',         //联系人名
        contactPeoplePhone:'',      //联系人手机
      },
      transform_list: {
        roles: [
          { value: "0", label: "经销商" },
          { value: "1", label: "售后" },
          { value: "2", label: "船东" },
          { value: "3", label: "船厂" },
          { value: "4", label: "其他" },
        ],
      },

    };
  },
  methods: {

    submit() {
      
      let post_url = this.$common.httpUrl + "/regist";

      let params =this.regist_form ;

      console.log(this.regist_form);

      this.$http.post(post_url, params).then((response) => {
        console.log("response", response);
        let res =  JSON.parse(response.bodyText);
        let code = res['code'];
        if (code == 200) {
          this.$message({
            showClose: true,
            message: '注册成功',
            center: true,
            type: 'success'
          });
          this.$router.replace({ path:'/'});
        }else{
          this.$message({
            showClose: true,
            message: '注册失败',
            center: true,
            type: 'error'
          });
        }
      });
    },

  },
};
</script>
