<template>
  <div class="maintance_list">
    <el-container>
      <el-header>
        <h1 align="center">我的申报单 <el-button icon="el-icon-s-tools" @click="logout">注销</el-button></h1>
      </el-header>
      <el-main>
        <div class="maintance_list">
            <el-table
                ref="multipleTable"
                :data="vResultList"
                highlight-current-row
                border stripe
                tooltip-effect="dark"
                style="width:100%"
                >
                <el-table-column
                    prop="product_name"
                    width="70px"
                    header-align="center"
                    align="center"
                    label="失物名">
                </el-table-column>
                <el-table-column
                    prop="status_text"
                    width="80px"
                    header-align="center"
                    align="center"
                    label="申请状态">
                </el-table-column>
                <el-table-column
                    prop="create_time_text"
                    min-width="80px"
                    header-align="center"
                    align="center"
                    label="申请时间">
                </el-table-column>
                <!-- <el-table-column
                    min-width="40px"
                    header-align="center"
                    align="center"
                    label="查看">
                    <template slot-scope="scope">
                      <el-button @click="seedetail(scope.row)" type="text" size="small">查看</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            <el-pagination
                small
                @size-change="handleSizeChange"
                @current-change="handleIndexChange"
                :page-size="page_info.pageSize"
                :pager-count="5"
                :page-sizes="[10 ,20, 50]"
                :current-page="page_info.pageIndex"
                :total="page_info.sourceTotal"
                layout="sizes, prev, pager, next"
                style="width:200px"
            >
            </el-pagination>
        </div>

      </el-main>

      <el-footer>
        <el-row>
          <el-col align="center">
            <el-button type="primary" @click="to_create_page" > 个人申请 </el-button>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
    <OutLayoutFooter></OutLayoutFooter>
    <!--查看记录 -->
    <el-dialog :visible.sync="showapplicantdetail" title="申请记录" width='98%'>
      <el-main>
        <el-form ref="add_form" :model="add_form" label-width="100px" label-position='left'>
          <el-row>
            <el-col >

              <el-form-item label="名字">
                <el-input
                  disabled
                  id="mc"
                  style="width: 200px"
                  v-model="add_form.show_product_name"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
         
          <el-row>
            <el-col >
              <el-form-item label="丢失时间" >
                 <el-input
                  disabled
                  id="sj"
                  style="width: 200px"
                  v-model="add_form.show_ecepte_time"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col >
              <el-form-item label="物品种类" v-model="add_form.show_product_type">
                  <el-input
                    disabled
                    style="width: 200px"
                    id="fl"
                    v-model="add_form.show_product_type"></el-input>                    
              </el-form-item>
            </el-col>
          </el-row>
      
          <el-row>
            <el-col >
              <el-form-item label="商品描述">
                <el-input
                  disabled
                  id="nr"
                  type="textarea"
                  style="width: 200px"
                  v-model="add_form.show_descp"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>  

        </el-form>
      </el-main>
    </el-dialog>
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
  props: ['bad_type'],
  name: "resetpwd",
   components:{
    OutLayoutFooter
  },
  data() {
    return {
      showapplicantdetail:false,
      add_form:{
        show_product_name: "",
        show_ecepte_time:"",
        show_product_type:"",
        show_product_seriable_number:"",
        show_descp:"",
        show_bad_type:"",
        show_data_time:"",
      },
      v_result_data   :       [],
      sear_form: {
        limit:'10',
        offset:'0',
      },
      logout_form: {
        userid:'1',
      },
      page_info:
      {
          pageIndex               :       1,
          pageSize                :       10,
          sourceTotal             :       0,
      },
      transform_list: {
      
        status: [
          { value: "0", label: "创建" },
          { value: "1", label: "售后开始处理" },
          { value: "2", label: "维修人员处理" },
          { value: "3", label: "处理完了" },
          { value: "4", label: "客户反馈" },
          { value: "5", label: "客户反馈完了" },
        ],
        bad_type_major_subjects: [
          { index:"0", value: "0-0", label: "开不了机" },
          { index:"1", value: "0-1", label: "开机自动关机" },
          { index:"2", value: "1-0", label: "不定位" },
          { index:"3", value: "1-1", label: "GPS信号时有时无" },
          { index:"4", value: "2-0", label: "黑屏" },
          { index:"5", value: "2-1", label: "花屏" },
          { index:"6", value: "2-2", label: "白屏" },
          { index:"7", value: "2-3", label: "屏幕有一条条竖线" },
          { index:"8", value: "2-4", label: "屏幕暗" },
          { index:"9", value: "3-0", label: "不发射" },
          { index:"10", value: "3-1", label: "不接受" },
          { index:"11", value: "3-2", label: "发射弱" },
          { index:"12", value: "3-3", label: "接受少" },
          { index:"13", value: "4-0", label: "按键无反应" },
          { index:"14", value: "4-1", label: "遥控不灵" },
          { index:"15", value: "4-2", label: "测深数值不准" },
          { index:"16", value: "4-3", label: "测不到水深" },
          { index:"17",value: "4-4", label: "其他" },
        ],
      }
    };
  },
  computed: {
      vResultList() {
        var datalist = this.v_result_data;

          console.log(datalist);
          return datalist;
      },
  },
  methods: {
    logout(){
        let post_url = this.$common.httpUrl + "/logout";

        let params =  this.logout_form ;

        this.$http.post(post_url, params).then((response) => {
        // console.log("response", response);
        let res = JSON.parse(response.bodyText);
        let code = res["code"];
        console.log("code", code);
        if (code == 200) {
          this.$message({
            showClose: true,
            message: "注销成功",
            center: true,
            type: "success",
          });
          this.$router.replace({ path: "/" });
        } else {
          this.$message({
            showClose: true,
            message: "error",
            center: true,
            type: "error",
          });
        }
      });
    },
    seedetail(row){
      this.transform_list.bad_type_major_subjects.forEach((element) => { 
        if (element.index == row.bad_type){
            let show_bad_type =element.label = element.label == null?"":element.label;
            this.add_form.show_bad_type = show_bad_type;
        }
      })

      this.add_form.show_product_name = row.product_name == null?"":row.product_name ;
    
      this.add_form.show_ecepte_time = row.create_time_text== null?"":row.create_time_text
      this.add_form.show_product_type = row.product_name ==row.product_type== null?"":row.product_type ;
      this.add_form.show_product_seriable_number = row.product_seriable_number== null?"":row.product_seriable_number ;
      this.add_form.show_descp = row.descp== null?"":row.descp ;

       //对话框显示
      this.showapplicantdetail = true;
      console.log(row);
         
    },
    to_create_page(){
      this.$router.push({ path: "/maintance_page" });
    },
    get_list(){

      let post_url = this.$common.httpUrl + "/maintance/list";

      this.sear_form.offset               =           (this.page_info.pageIndex - 1) * this.page_info.pageSize;
      this.sear_form.limit                =           this.page_info.pageSize;
      let params =  this.sear_form ;
      // console.log(post_url,params);
      this.$http.post(post_url, params).then((response) => {
        console.log("response", response);
        let res = JSON.parse(response.bodyText);
        // let res = response.body;
        let code = res["code"];
        console.log("code", code); 
        if (code == 200) {
          let result_list = res['data']['maintanceList'];
          console.log("result_list", result_list);
          
          this.v_result_data = result_list;
          this.page_info.sourceTotal = res['data']['count'];

        } else {
          this.$message({
            showClose: true,
            message: "no data",
            center: true,
            type: "error",
          });
        }
      });
      
    },
    handleSizeChange(size) {
        "use strict";
        this.page_info.pageSize = size;
        this.get_list();
    },
    handleIndexChange(index) {
        "use strict";
        this.page_info.pageIndex = index;
        this.get_list();
    }
  },
  mounted: function () {
      "use strict";
      this.get_list();
  }
};
</script>
