<template>
  
  <div>
    <el-page-header :content="id ? '商品详情':'新增商品'" @back="$router.back()" style="margin-bottom:10px;" />

  <el-card shadow="never">
    <div class="content-box">
      <el-steps :active="active" align-center style="margin:0 auto 20px auto;">
        <el-step title="商品基本信息" />
        <el-step title="推荐指标" />
      </el-steps>
      <el-form :model="form" label-width="120px" :inline="true" ref="ruleFormRef" :rules="rules">
        <div v-show="active == 1">

          <el-form-item label="商品名:" prop="name" style="width:100%;">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="商品英文名:" prop="enName" style="width:100%;">
            <el-input v-model="form.enName" />
          </el-form-item>
          <el-form-item label="原价:" prop="originPrice" style="width:100%;">
            <el-input v-model="form.originPrice" />
          </el-form-item>
          <el-form-item label="产品描述:" prop="description" style="width:100%;">
            <el-input v-model="form.description" />
          </el-form-item>
          <el-form-item label="产品分类ID:" prop="productBaseInfoId" style="width:100%;">
            <el-input v-model="form.productBizInfo.productBaseInfoId" type="number" />
          </el-form-item>
          <el-form-item label="售价:" prop="normalPrice">
            <el-input v-model="form.normalPrice" type="number" />
          </el-form-item>
          <el-form-item label="封面图片:">
            <div class="img"><img :src="form.imgUrl.img" alt="产品图片"></div>
            <div class="img"><img :src="form.imgUrl.skuImg" alt="产品详情图片"></div>
          </el-form-item>
          <el-form-item label="商品图:" style="width:100%;">
            <el-upload action="" list-type="picture-card" :file-list="FileList" :http-request="uploadImgs" :before-remove="beforeRemove" :on-preview="handlePictureCardPreview" :on-success="handleImgSuccess2">
              <el-icon>
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
        </div>

        <div v-show="active == 2">
          <div style="font-weight:700;padding-bottom: 20px;">品鉴信息</div>
          <el-form-item label="真实库存:" prop="realStock">
            <el-input v-model="form.realStock" type="number" />
          </el-form-item>

          <el-form-item label="逻辑库存:" prop="logicStock">
            <el-input v-model="form.logicStock" type="number" />
          </el-form-item>

          <el-form-item label="展示库存:" prop="showStock">
            <el-input v-model="form.showStock" type="number" />
          </el-form-item>
          <el-form-item label="是否有库存:" prop="soldSeparately">
            <el-input v-model="form.soldSeparately" />
          </el-form-item>

          <el-form-item label="更新时间:" prop="updateTime" style="width:100%;">
            <el-input v-model="form.updateTime" />
          </el-form-item>
          <el-form-item label="创建时间:" prop="createTime" style="width:100%;">
            <el-input v-model="form.createTime" />
          </el-form-item>

          <el-form-item label="划线价:" prop="underlinedPrice">
            <el-input v-model="form.underlinedPrice" type="number" />
          </el-form-item>


          <el-form-item label="单位:" prop="unit">
            <el-input v-model="form.productBizInfo.unit" />
          </el-form-item>
          <el-form-item label="克数:" prop="unitWeight">
            <el-input v-model="form.productBizInfo.unitWeight" type="number" />
          </el-form-item>
          <el-form-item label="每月数量:" prop="monthNum">
            <el-input v-model="form.productBizInfo.monthNum" type="number" />
          </el-form-item>

  
        </div>
      </el-form>

      <div style="text-align:center;margin-top:50px;">
        <el-button v-show="active!=1" @click="active -= 1">上一步</el-button>
        <el-button v-show="active!=2" @click="active += 1">下一步</el-button>
        <el-button type="primary" @click="formValidate()">保存</el-button>
      </div>
    </div>
  </el-card>

  <el-dialog v-model="imgDialogVisible">
    <img :src="dialogImageUrl" style="width:100%;" />
  </el-dialog>
  </div>
</template>
<script>
import address from "./address.json";
export default {
  data() {
    return {
      active: 1,
      id: null, //商品ID
      fileList: [],
      form: {
        originPrice: "", //原价
        normalPrice: "", //售价
        realStock: "", //真实库存
        logicStock: 0,
        name: "", //名字
        enName: "",
        createTime:"",
        updateTime: "",
        soldSeparately:"",
        imgUrl: {
          img: "",
          skuImg: "",
          tonicDetail: [],
          efficacyDetail: []
        },
        productBizInfo: {
          monthNum: 0,
          unit: "",
          unitWeight: 0,
          productBaseInfoId:0,
        },
      },
      
      address: address,
      rules: {
        name: [{ required: true, message: "请填写商品名称", trigger: "blur" }],
        enName: [{ required: false, message: "请填写商英文名称", trigger: "blur" }],
        description: [{ required: false, message: "请填写产品描述", trigger: "blur" }],
        logicStock: [{ required: true, message: "请填写逻辑库存", trigger: "blur" }],
        underlinedPrice	: [{ required: true, message: "划线价", trigger: "blur" }],
        showStock: [{ required: true, message: "展示库存", trigger: "blur" }],
        normalPrice: [{ required: true, message: "请填写售价", trigger: "blur" },],
        realStock: [{ required: true, message: "请填写真实库存", trigger: "blur" }],
        imgUrl: [{ required: true, message: "图片", trigger: "blur" }],
      },
    };
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getProductInfo();
    }
  },
  methods: {
    // 查询商品详情
    async getProductInfo() {
      const res = await this.$request.get(
        "/mall/cms/api/v1/product/get_product_info?id=" + this.id
      );
      if (res.data.code === 200) {
        this.form = res.data.data;
      }
    },
    //表单校验
    formValidate() {
      this.$refs.ruleFormRef.validate((valid) => {
        if (valid) {
          //表单校验成功
          this.addProduct();
          
        }
      });
    },
    // 处理表单修改的数据，数据发送到后端
    async saveData() {
    try {
      const res = await this.$request.post("/mall/cms/api/v1/product/update_product_info", this.form);
      if (res.data.code === 200) {
        this.$message.success("保存成功");
        this.$router.back();
      } else {
        this.$message.error("保存失败");
      }
    } catch (error) {
        this.$message.error("网络错误");
      }
    },
    // 添加或更新商品
    async addProduct() {
      this.form.price = this.form.salesPrice //强制原价等于售价
      const res = await this.$request.post(
        this.id
          ? "/mall/cms/api/v1/product/update_product_info"
          : "/mall/cms/api/v1/product/add_product_info",
          
        this.form
      );
      if (res.data.code === 200) {
        this.$message.success(res.data.message);
        this.$router.back();
      }
    },
    
    // 上传图片
    async uploadImgs(option) {
      let formData = new FormData();
      formData.append("file", option.file);
      const res = await this.$request.post(
        "/mall/cms/api/v1/product/update_product_info",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data.code === 200) {
        option.onSuccess(res.data.data);
      } else {
        option.onError();
      }
    },
    
    // 封面图上传成功后
    handleImgSuccess2(url) {
      if (url) {
        this.form.desc.pics.push(url);
      }
    },

    //删除图片时前置钩子
    beforeRemove(option) {
      //当删除图片时候也应该移除表单中对应的图片
      let index = this.FileList.indexOf(option);
      this.form.desc.pics.splice(index, 1);
      return true;
    },
  
    // 放大图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.imgDialogVisible = true;
    },
  },
};
</script>

<style scoped>
.el-select {
  width: 100%;
}

.el-form-item {
  display: flex;
}

.content-box {
  width: 1000px;
  margin: 0 auto;
}

.avatar-uploader .avatar {
  width: 148px;
  height: 148px;
  display: block;
  object-fit: contain;
}
</style>

<style>
.el-textarea__inner {
  height: 100%;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  background-color: #fafafa;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  text-align: center;
}
.img {
  margin-right: 10px;
  width: 148px;
  height: 148px;
  border-style: dashed; 
  border-width: 1px;    
  border-color: #000;  
  border-radius: 10px; 
}
.zhanshi {
  width: 348px;
  height: 32px;
  border-style: solid; 
  border-width: 1px;    
  border-color: rgb(228, 221, 221);  
  border-radius: 3px; 
}
.img img {
    width: 100%;
  }
</style>