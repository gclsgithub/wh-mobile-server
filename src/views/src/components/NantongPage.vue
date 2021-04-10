<template>
  <div class="maintance_page">
    <el-container>
      <h1 align="center">失物申报</h1>

      <el-main>
        <el-form ref="add_form" :model="add_form" :rules="rule_add_form" label-width="100px" label-position='left'  >
          <el-row>
            <el-col >
              <el-form-item label="物品名" prop="mc">
               <el-input
                  type="text"
                  style="width: 200px"
                  v-model="add_form.mc"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col >
              <el-form-item label="丢失地点" prop="dd">
               <el-input
                  type="text"
                  style="width: 200px"
                  v-model="add_form.dd"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col >
              <el-form-item label="物品颜色" prop="ys">
               <el-input
                  type="text"
                  style="width: 200px"
                  v-model="add_form.ys"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

           <el-row>
            <el-col >
              <el-form-item label="物品材质" prop="cz">
               <el-input
                  type="text"
                  style="width: 200px"
                  v-model="add_form.cz"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row >
              <el-col >
                <el-form-item label="物品分类" prop="fl">
                  <el-select
                    v-model="add_form.fl"
                    @change="current_sel"
                    style="width: 200px"
                  >
                    <el-option
                      v-for="item in transform_list.product_categoery"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
          </el-row>
          <el-row>
            <el-col >
              <el-form-item label="丢失时间" prop="sj">
                <el-date-picker
                  v-model="add_form.sj"
                  type="date"
                  style="width: 200px"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="timestamp"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col >
            <el-form-item label="物品图片">
              <el-upload
                action="#"
                list-type="picture-card"
                :file-list="uploadFiles"
                :on-change="loadJsonFromFile"
                :auto-upload="false"
              >
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{ file }">
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url"
                    alt=""
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-preview"
                      @click="handlePictureCardPreview(file)"
                    >
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span
                      v-if="!disabled"
                      class="el-upload-list__item-delete"
                      @click="handleDownload(file)"
                    >
                      <i class="el-icon-download"></i>
                    </span>
                    <span
                      v-if="!disabled"
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
            </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col >
              <el-form-item label="详细描述" prop="nr">
                <el-input
                  type="textarea"
                  style="width: 200px"
                  v-model="add_form.nr"
                ></el-input>
              </el-form-item>

            </el-col>
          </el-row>
          <el-row>
            <el-col >
              <el-form-item
                label="返还形式"
                v-model="add_form.maintenance_type">
                <el-radio
                 @change="up_door_service_info(2)"
                  v-model="add_form.maintenance_type"
                  label="1"
                  border
                  size="mini"
                  >上门取得</el-radio>
                <el-radio
                  v-model="add_form.maintenance_type"
                  label="2"
                  border
                  size="mini"
                  >邮寄</el-radio
                >
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 上门服务时显示此词条 -->
          <el-row>
            <el-col >
              <el-form-item label="联系人" v-if="add_form.maintenance_type == 1">

                <el-tag
                  :key="tag.connect_phone"
                  v-for="tag in dynamicTags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)">
                  {{tag.connect_name}},{{tag.connect_phone}}
                </el-tag>

                <el-button
                  type="primary"
                  size="small"
                  @click="add_contact_person"
                >
                  添加
                </el-button>

              </el-form-item>

            </el-col>
          </el-row>
          <!-- 寄修维修时显示此词条 -->
          <el-row >
            <el-col >
              <el-form-item
                label="快递单号"
                v-model="add_form.express_code"
                v-if="add_form.maintenance_type == 2">
                  <el-input
                    id="expressCode"
                    style="width: 200px"
                    v-model="add_form.express_code"
                  ></el-input>
                  <el-button type="info" @click="begin_scan(3)">开始扫描</el-button>
              </el-form-item>

            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col >
              <el-form-item label="收费标准">
                <el-button type="primary" size="medium" @click="show_price"> 查看 </el-button>
              </el-form-item>
            </el-col>
          </el-row> -->
        </el-form>
      </el-main>

      <el-footer>
        <div align="center">
          <el-button @click="to_maintance_list()">返回</el-button>
          <el-button type="success" @click="submit"> 提交 </el-button>
        </div>
      </el-footer>
    </el-container>
    <OutLayoutFooter></OutLayoutFooter>
    <!--扫描的对话框 -->
    <el-dialog :visible.sync="dialogQrCodeVisible" title="上传条形码" width='90%'>
      <el-col :lg="10" :md="16" :xs="24">
          <div class="grid-content">
            <div class="titletext"></div>
              <input
                type="file"
                @change="handleFileChange($event)"
                id="barCode"
                accept="image/*"
                mutiple="mutiple"
                capture="camera"
              />
          </div>
        </el-col>
        <div align="right">
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogFormVisible" title="添加联系人" width='90%'>
      <el-form ref="contact_person_form" :model="contact_person_form">
        <el-form-item label="姓名:">
          <el-input
            style="width: 200px"
            v-model="connect_people.connect_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="住址:">
          <el-input
            style="width: 200px"
            v-model="connect_people.connect_address"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机:">
          <el-input
            style="width: 200px"
            v-model="connect_people.connect_phone"
          ></el-input>
        </el-form-item>
      </el-form>
      <div align="right">
        <el-button @click="add_connect">确定</el-button>
      </div>
    </el-dialog>
    
    <el-dialog :visible.sync="price_dialogFormVisible" title="收费标准" fullscreen>
    </el-dialog>

    <el-dialog :visible.sync="showUpdoorServiceVisible" title="收费提示" width="90%">
       <span>上门服务需要收取费用，详细费用请至电查询。</span>
       <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="showUpdoorServiceVisible = false">确 定</el-button>
       </span>
    </el-dialog>
    

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import ElementUI from "element-ui";
import http from "vue-resource";
import OutLayoutFooter from './OutLayout/Footer.vue'
import Quagga from 'quagga'

Vue.prototype.$Quagga = Quagga 

Vue.use(ElementUI);
Vue.use(http);
export default {
  name: "nan_tong",
  components:{
    OutLayoutFooter
  },
  data() {
    //1
    let check_product_name = (rule, value, callback) => {
      if (this.add_form.mc == null || this.add_form.mc == "") {
        return callback(new Error("请输入丢失商品名称"));
      } else {
        callback();
      }
    };
    //2
    let check_dd = (rule, value, callback) => {
      if (this.add_form.dd == null || this.add_form.dd == "") {
        return callback(new Error("请输入丢失物品的地点"));
      } else {
        callback();
      }
    };
    //3
    let check_ys = (rule, value, callback) => {
      if (this.add_form.ys == null || this.add_form.ys == "") {
        return callback(new Error("请输入丢失物品的颜色"));
      } else {
        callback();
      }
    };

    let check_cz = (rule, value, callback) => {
      if (this.add_form.cz == null || this.add_form.cz == "") {
        return callback(new Error("请输入丢失物品的材质"));
      } else {
        callback();
      }
    };
    //4
    let check_bad_type_major_subject = (rule, value, callback) => {
      if (this.add_form.bad_type_major_subject == null || this.add_form.bad_type_major_subject == "") {
        return callback(new Error("主要故障请选择"));
      } else {
        callback();
      }
    };
    //5
    let check_pl = (rule, value, callback) => {
      if (this.add_form.pl == null || this.add_form.pl == "") {
        return callback(new Error("请选择丢失物品的分类"));
      } else {
        callback();
      }
    };
    let check_serveice_time = (rule, value, callback) => {
      if (this.add_form.sj == null || this.add_form.sj == "") {
        return callback(new Error("请丢失时间"));
      } else {
        callback();
      }
    };
    let check_product_type = (rule, value, callback) => {
      if (this.add_form.fl == null || this.add_form.fl == "") {
        return callback(new Error("请选择产品种别"));
      } else {
        callback();
      }
    };
    
    let check_descp = (rule, value, callback) => {
      if (this.add_form.nr == null || this.add_form.nr == "") {
        return callback(new Error("检查丢失物品描述"));
      } else {
        callback();
      }
    };
    return {
      rule_add_form: {
        mc: [{ validator: check_product_name, trigger: "blur" }],
        dd: [{ validator: check_dd, trigger: "blur" }],
        ys: [{ validator: check_ys, trigger: "blur" }],
        bad_type_major_subject: [{ validator: check_bad_type_major_subject, trigger: "blur" }],
        pl: [{ validator: check_pl, trigger: "blur" }],
        sj: [{ validator: check_serveice_time, trigger: "blur" }],
        fl: [{ validator: check_product_type, trigger: "blur" }],
        cz: [{ validator: check_cz, trigger: "blur" }],
        nr: [{ validator: check_descp, trigger: "blur" }],
      },
      showUpdoorServiceVisible: false,
      activeName: "second_login",
      scanflag:"1",
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      dialogFormVisible: false,
      dialogQrCodeVisible:false,
      price_dialogFormVisible:false,
      inputVisible: false,
      inputValue: '',
      dynamicTags: [],
      major_subject_list: [],
      uploadFiles: [],
      add_form: {
        mc: "", //loose thing name
        dd: "", //产品描述
        ys: "", //故障列别1
        cz: "",
        bad_type_major_subject: "", //故障列别2
        bad_type_desp: "", //类别2为其他时的详细
        sj: "", //维修时间 1609426800000
        fl: "", //产品类别
        product_seriable_number: "", //产品型号
        bad_images: [], //故障图片
        nr: "", //故障描述
        maintenance_type: "1", //维修分类
        express_code: "", //快递单号
        connect_peoples: [], //联系人信息
      },
      connect_people: {
        //联系人信息
        connect_name: "", //联系人信息
        connect_address: "", //联系人住址
        connect_phone: "", //联系人电话
      },
      contact_person_form: {},
      transform_list: {
        products: [
          { value: "1", label: "AIS" },
          { value: "2", label: "鱼探测仪" },
          { value: "3", label: "测深仪" },
          { value: "4", label: "换能器" },
          { value: "5", label: "电子海图系列" },
          { value: "6", label: "导航仪" },
          { value: "7", label: "天线" },
          { value: "8", label: "板子" },
          { value: "9", label: "其他" }
	],
        product_categoery: [
          { value: "1", label: "图书" },
          { value: "2", label: "数码产品" },
          { value: "3", label: "证件" },
          { value: "4", label: "生活用品" },
          { value: "5", label: "食物" },
          { value: "6", label: "衣服" },
          { value: "7", label: "学习用品" },
          { value: "8", label: "其他" },
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
      },
    };
  },
  methods: {
    loadJsonFromFile(file, fileList) {
      this.uploadFiles = fileList;
    },
    confirm_code(){
      this.dialogQrCodeVisible = false;
      //改变值
    },
    show_price(){
      this.price_dialogFormVisible = true;
    },
    decode1(file) {
      Quagga.decodeSingle(
        {
          inputStream: {
            size: 800, // 这里指定图片的大小，需要自己测试一下
            singleChannel: false
          },
          locator: {
            patchSize: 'medium',
            halfSample: false
          },
          numOfWorkers: 1,
          decoder: {
            readers: [
              {
                format: 'code_128_reader', // ean_reader 这里指定ean条形码，就是国际13位的条形码   code39    code_128
                config: {}
              }
            ]
          },
          // readers: ['code_128_reader'],
          locate: true,
          src: URL.createObjectURL(file)
        },
        function(result) {
          let code = result.codeResult.code;
          document.getElementById("product_type").value=code;
        }
      )
    },
    decode2(file) {
      Quagga.decodeSingle(
        {
          inputStream: {
            size: 800, // 这里指定图片的大小，需要自己测试一下
            singleChannel: false
          },
          locator: {
            patchSize: 'medium',
            halfSample: false
          },
          numOfWorkers: 1,
          decoder: {
            readers: [
              {
                format: 'code_128_reader', // ean_reader 这里指定ean条形码，就是国际13位的条形码   code39    code_128
                config: {}
              }
            ]
          },
          // readers: ['code_128_reader'],
          locate: true,
          src: URL.createObjectURL(file)
        },
        function(result) {
          let code = result.codeResult.code;
          document.getElementById("product_seriable_number").value=code;
        }
      )
    },
    decode3(file) {
      Quagga.decodeSingle(
        {
          inputStream: {
            size: 800, // 这里指定图片的大小，需要自己测试一下
            singleChannel: false
          },
          locator: {
            patchSize: 'medium',
            halfSample: false
          },
          numOfWorkers: 1,
          decoder: {
            readers: [
              {
                format: 'code_128_reader', // ean_reader 这里指定ean条形码，就是国际13位的条形码   code39    code_128
                config: {}
              }
            ]
          },
          // readers: ['code_128_reader'],
          locate: true,
          src: URL.createObjectURL(file)
        },
        function(result) {
          let code = result.codeResult.code;
          document.getElementById("expressCode").value=code;
        }
      )
    },
    handleFileChange(evt) {
      console.log('evt', evt)
      const file = evt.target.files[0];
      if (this.scanflag == "1"){
        this.decode1(file);
      } else if (this.scanflag == "2"){
        this.decode2(file);
      } else if (this.scanflag == "3"){
        this.decode3(file);
      }
      this.dialogQrCodeVisible = false;
      this.showapplicantdetail = false;
      this.showUpdoorServiceVisible = false;
      evt.target.value = null;
    },
    current_sel() {
      // console.log(
      //   "add_form.bad_type_category",
      //   this.add_form.bad_type_category
      // );
      // this.$alert('wwww.aaaa.com', '提示消息', {
      //     confirmButtonText: '确定',
      //     callback: action => {
      //       this.$message({
      //         type: 'info',
      //         message: `action: ${ action }`
      //       });
      //     }
      //   });
      this.add_form.bad_type_major_subject = "";
      this.major_subject_list = this.transform_list.bad_type_major_subjects.filter(
        (element) =>
          element.value.split("-")[0] == this.add_form.bad_type_category
      );
    },
    begin_scan(myScanflag){
      this.scanflag = myScanflag;
      this.dialogQrCodeVisible = true;
    },
    //摄像头开启
    camerastart() {
      let constraints = { video: { facingMode: { exact: 'environment' }  } ,audio:false  };
      let video = document.getElementById("camera"); //video标签的对象？展示的区域？
      //获得Canvas对象
      let canvas = document.getElementById("canvas");
      let Context = canvas.getContext("2d");
      //调用摄像头
      let promise = navigator.mediaDevices.getUserMedia(constraints); //好像现在这样调用是主流方法
      promise.then(mediaStream => {
          this.videoobj =  mediaStream.getTracks();
          try {
            video.srcObject = mediaStream;
          } catch (error) {
            console.log(error);
            video.src = window.URL.createObjectURL(mediaStream);
          }
          video.play();
        })
        .catch(err => {
          this.$message.error("调用摄像头失败，请检查摄像头连接是否有问题。错误信息：" + err);
        });
      //每过1秒获取一次图片
      const getimgsetInterval2 = setInterval(() => {this.takephoto(video,canvas,Context)}, 1000);
      this.$once('hook:beforeDestroy', () => {            
        clearInterval(getimgsetInterval2);                                    
      })
    },
    to_maintance_list(){
        this.$router.replace({ path: "/maintance_list" });
    },
    up_door_service_info(flag){
      console.log(flag);
      if (this.add_form.maintenance_type == 1){
        this.showUpdoorServiceVisible = true;
      }
    },
    submit() {
      this.$refs["add_form"].validate((valid) => {

        if (valid) {
      this.add_form.connect_peoples = this.dynamicTags;

      this.uploadFiles.forEach((element) => {
        let file = element;
        // 接下来可对文件内容进行处理
        this.add_form.bad_images.push(file);
      });

      console.log(this.add_form);

      let formData = new FormData();
      let jsonData = JSON.stringify(this.add_form);
      formData.append("data", jsonData);
    
      for(let i=0;i<=this.add_form.bad_images.length-1;i++){
        formData.append("files", this.add_form.bad_images[i].raw,this.add_form.bad_images[i].raw.name);
      }
      let config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      let post_url = this.$common.httpUrl + "admin/maintance/dosubmit";
      console.log(formData);
      this.$http.post(post_url, formData, config).then((response) => {
        console.log("response", response);
        let res = JSON.parse(response.bodyText);
        let code = res["code"];
        if (code == 200) {
          this.$message({
            showClose: true,
            message: "申报成功",
            center: true,
            type: "success",
          });
          this.to_maintance_list();
        } else {
          this.$message({
            showClose: true,
            message: "申报失败",
            center: true,
            type: "error",
          });
        }
      });
        }
      });
    },

    // 联系人tag添加
    add_contact_person() {
      this.dialogFormVisible = true;
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      console.log('tag',tag);
      console.log('dynamicTags',this.dynamicTags);
    },
    add_connect() {
      this.dynamicTags.push(this.connect_people);
      this.dialogFormVisible = false;
      this.connect_people =       
      {
        //联系人信息
        connect_name: "", //联系人信息
        connect_address: "", //联系人住址
        connect_phone: "", //联系人电话
      };
      this.$message({
        type: "success",
        message: "添加成功!",
      });
    },

    handleRemove(file) {
      console.log(file, this.fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
  },
};
</script>
