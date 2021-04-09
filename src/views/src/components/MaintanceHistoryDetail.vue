<template>
  <div class="maintance_page">
    <el-container>
      <h1 align="center">维修单申报详细</h1>

      

      <el-footer>
       <el-button @click="$router.back(1)">返回</el-button>
      </el-footer>
    </el-container>
    <OutLayoutFooter></OutLayoutFooter>
    <el-dialog :visible.sync="price_dialogFormVisible" title="收费标准" fullscreen>
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
  name: "nan_tong_history_detail",
  components:{
    OutLayoutFooter
  },
  created () {
    // 组件创建完后获取数据，
    // 此时 data 已经被 observed 了
    this.fetchData()
  },

  data() {
    return {
      bad_type:'',
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
        porduct_type_id: "", //产品类别
        porduct_type_descp: "", //产品描述
        bad_type_category: "", //故障列别1
        bad_type_major_subject: "", //故障列别2
        bad_type_desp: "", //类别2为其他时的详细
        serveice_time: "", //维修时间 1609426800000
        product_type: "", //产品类别
        product_seriable_number: "", //产品型号
        bad_images: [], //故障图片
        descp: "", //故障描述
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
          { value: "0", label: "AIS" },
          { value: "1", label: "⻥探仪" },
          { value: "2", label: "测深仪" },
          { value: "3", label: "换能器" },
          { value: "4", label: "电子海图系列" },
          { value: "5", label: "导航仪" },
          { value: "6", label: "天线" },
          { value: "7", label: "板子" },
          { value: "8", label: "其他" },
        ],
        bad_type_category: [
          { value: "0", label: "开机问题" },
          { value: "1", label: "定位问题" },
          { value: "2", label: "屏幕问题" },
          { value: "3", label: "接受发射问题" },
          { value: "4", label: "其他" },
        ],
        bad_type_major_subjects: [
          { value: "0-0", label: "开不了机" },
          { value: "0-1", label: "开机自动关机" },
          { value: "1-0", label: "不定位" },
          { value: "1-1", label: "GPS信号时有时无" },
          { value: "2-0", label: "黑屏" },
          { value: "2-1", label: "花屏" },
          { value: "2-2", label: "白屏" },
          { value: "2-3", label: "屏幕有一条条竖线" },
          { value: "2-4", label: "屏幕暗" },
          { value: "3-0", label: "不发射" },
          { value: "3-1", label: "不接受" },
          { value: "3-2", label: "发射弱" },
          { value: "3-3", label: "接受少" },
          { value: "4-0", label: "按键无反应" },
          { value: "4-1", label: "遥控不灵" },
          { value: "4-2", label: "测深数值不准" },
          { value: "4-3", label: "测不到水深" },
          { value: "4-4", label: "其他" },
        ],
      },
    };
  },
  ready: function(){
    

      // var bad_type = this.$route.params.bad_type;

      // var except_time = this.$route.params.serveice_time;

      // var product_type_id = this.$route.params.porduct_type_id;

      // var product_seriable_id = this.$route.params.product_seriable_number;

      // var product_desc = this.$route.params.descp;

      // console.log("product_name"+product_name);
      // console.log("bad_type"+bad_type);
      // console.log("except_time"+except_time);
      // console.log("product_type_id"+product_type_id);
      // console.log("product_seriable_id"+product_seriable_id);
      // console.log("product_desc"+product_desc);
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true
      // replace getPost with your data fetching util / API wrapper
      // getPost(this.$route.params.bad_type, (err, post) => {
      //   this.loading = false
      //   if (err) {
      //     this.error = err.toString()
      //   } else {
      //     this.post = post
      //   }
      // })
    
        var routerParams = this.$route.params.bad_type
        // 将数据放在当前组件的数据内
        this.routerParams = routerParams

      

      console.log("product_name"+routerParams);
    },
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
    
    handleFileChange(evt) {
      console.log('evt', evt)
      const file = evt.target.files[0];
      if (this.scanflag == "1"){
        this.decode1(file);
      } else if (this.scanflag == "2"){
        this.decode2(file);
      }
      this.dialogQrCodeVisible = false;
      evt.target.value = null;
    },
    current_sel() {
      // console.log(
      //   "add_form.bad_type_category",
      //   this.add_form.bad_type_category
      // );
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
    
    to_maintance_list(){
        this.$router.replace({ path: "/maintance_list" });
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
