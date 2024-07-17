<template>
  
  <div>
    <el-page-header :content="id ? '编辑商品':'新增商品'" @back="$router.back()" style="margin-bottom:10px;" />

  <el-card :data="changeinfo" shadow="never">
    <div class="content-box">
      <el-steps :active="active" align-center style="margin:0 auto 20px auto;">
        <!-- <el-step title="基础信息" /> -->
        <el-step title="基础信息" />
        <el-step title="详情页内容" />
      </el-steps>
      <el-form :model="form" label-width="120px" :inline="true" ref="ruleFormRef" :rules="rules">
        

        <div v-show="active == 1">
          <el-row>
            <el-col :span="12">
              <el-form-item  label="商品名称:" style="display:flex;">
                <el-input v-model="changeinfo.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="SKU:" style="display:flex;">
                <el-input v-model="changeinfo.unit" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="SPU:" style="display:flex;">
                <el-input v-model="changeinfo.unitWeight" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="规格名称:" style="display:flex;">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品大类:" prop="dalei">
                <el-select v-model="form.dalei" placeholder="选择大类">
                  <el-option label="1" value="1" />
                  <el-option label="2" value="2" />
                  <el-option label="3" value="3" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品细类:" prop="xilei">
                <el-select v-model="form.xilei" placeholder="选择商品细类">
                  <el-option label="1" value="1" />
                  <el-option label="2" value="2" />
                  <el-option label="3" value="3" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="场景:" prop="changjing">
                <el-select v-model="form.changjing" placeholder="选择场景">
                  <el-option label="1" value="1" />
                  <el-option label="2" value="2" />
                  <el-option label="3" value="3" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="毛利率:" style="display:flex;">
                <el-input />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="进货价:" style="display:flex;">
                <el-input v-model="changeinfo.underlinedPrice" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="零售价:" style="display:flex;">
                <el-input v-model="changeinfo.originPrice" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="资料负责人:" style="display:flex;">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="保质期:" style="display:flex;">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="品牌:" style="display:flex;">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="品牌(英文):" style="display:flex;">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品毛重:" style="display:flex;">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品材质" style="display:flex;">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="颜色:" prop="color">
                <el-select v-model="form.color" placeholder="选择颜色">
                  <el-option label="1" value="1" />
                  <el-option label="2" value="2" />
                  <el-option label="3" value="3" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="到货时间" style="display:flex;">
                <el-input v-model="changeinfo.updateTime" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生命周期:" prop="life">
                <el-select v-model="form.life" placeholder="选择生命周期">
                  <el-option label="1" value="1" />
                  <el-option label="2" value="2" />
                  <el-option label="3" value="3" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品规格" style="display:flex;">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="内部评分:" style="display:flex;">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="存储方式" style="display:flex;">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商编码:" style="display:flex;">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商" style="display:flex;">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="起订量:" style="display:flex;">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产天数" style="display:flex;">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否上架::" prop="ifwork">
                <el-select v-model="form.ifwork" placeholder="选择是否">
                  <el-option label="是" value="100" />
                  <el-option label="否" value="150" />
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>

        </div>

        <div v-show="active == 2">
          <el-form-item label="封面图片:">
            <div class="img"><img :src="changeinfo.imgUrl.img" alt="产品图片"></div>
            
          </el-form-item>
          <el-form-item label="商品介绍:">
            <el-input v-model="changeinfo.tags" :autosize="{ minRows: 2, maxRows: 6 }" type="textarea" style="margin-bottom:10px;" />
            
          </el-form-item>

          <el-form-item label="详情页图片:">
            <div style="display:flex; width: 100%;">
              <div class="img"><img :src="changeinfo.imgUrl.skuImg" alt="产品详情图片"></div>
              <div class="img"></div>
              <div class="img"></div>
              <el-upload class="avatar-uploader" action="" :show-file-list="false" :http-request="uploadImgs" :on-success="handleImgSuccess3">
                <img v-if="form.desc.attrMap.产区介绍pic" :src="form.desc.attrMap.产区介绍pic" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </div>
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

  </div>
</template>

<script>
import address from "./address.json";
export default {
  data() {
    return {
      active: 1,
      changeinfo: [],
      id: null, 
      form: {
        desc: {
          pics: [],
          attrMap: {
            产区介绍pic:"",
            适用场景: ""
          },
        },
      },
      address: address,
      rules: {
        xilei: [{ required: true, message: "请选择细类", trigger: "change" }],
        color: [{ required: true, message: "请选择颜色", trigger: "change" }],
        ifwork: [{ required: true, message: "请选择是否", trigger: "change" }],
        life: [{ required: true, message: "请选择生命周期", trigger: "change" }],
        dalei: [
          { required: true, message: "请选择大类", trigger: "change" },
        ],
        changjing: [{ required: true, message: "请选择场景", trigger: "change" }]
      },
    };
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.aa();
    }
  },
  methods: {
    // 查询商品详情
    async aa() {
      const res = await this.$request.get(
        "/mall/cms/api/v1/product/get_product_info?id=" + this.id
      );
      if (res.data.code === 200) {
        this.changeinfo = res.data.data;
      }
    },
    
    //表单校验
    formValidate() {
      this.$refs.ruleFormRef.validate((valid) => {
        if (valid) {
          //表单校验成功
          this.saveData();
        }
      });
    },
    // 添加或更新商品
    // 处理表单修改的数据，数据发送到后端
    async saveData() {
    try {
      const res = await this.$request.post("/mall/cms/api/v1/product/update_product_info", this.productInfo);
      if (res.data.code === 200) {
        this.$message.success("保存成功");
      } else {
        this.$message.error("保存失败");
      }
    } catch (error) {
        this.$message.error("网络错误");
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
    
    // 产区介绍图片
    handleImgSuccess3(url) {
      if (url) {
        this.form.desc.attrMap.产区介绍pic = url;
      }
    },
    // 封面图上传成功后
    handleImgSuccess2(url) {
      if (url) {
        this.form.desc.pics.push(url);
      }
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