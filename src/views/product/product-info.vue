<template>
  
  <div>
    <el-page-header :content="id ? '商品详情':'新增商品'" @back="$router.back()" style="margin-bottom:10px;" />

  <el-card shadow="never">
    <div class="content-box">
      <el-steps :active="active" align-center style="margin:0 auto 20px auto;">
        <el-step title="商品基本信息" />
        <el-step title="推荐指标" />
        <el-step title="商品详细信息" />
      </el-steps>
      <el-form :model="form" label-width="120px" :inline="true" ref="ruleFormRef" :rules="rules">
        <div v-show="active == 1">
          <el-form-item label="标题:" prop="titleName" style="width:100%;">
            <el-input v-model="form.titleName" />
          </el-form-item>

          <el-form-item label="商品名:" prop="title" style="width:100%;">
            <el-input v-model="form.title" />
          </el-form-item>

          <el-form-item label="商品英文名:" style="width:100%;">
            <el-input v-model="form.titleEn" />
          </el-form-item>

          <el-form-item label="商品编码:" prop="code" style="width:100%;">
            <el-input v-model="form.code" />
          </el-form-item>


          <el-form-item label="品类:" prop="categoryId" style="width:100%;">
            <el-select v-model="form.categoryId" placeholder="选择类别" @change="formCategoryChange()">
              <el-option label="红葡萄酒" :value="1" />
              <el-option label="白葡萄酒" :value="2" />
              <el-option label="起泡酒" :value="3" />
            </el-select>
          </el-form-item>

          <el-form-item label="商品描述:" style="width:100%;">
            <el-input v-model="form.desc.descText" />
          </el-form-item>

          <el-form-item label="售价:" prop="salesPrice">
            <el-input v-model="form.salesPrice" type="number" />
          </el-form-item>

          <!-- <el-form-item label="原价:">
            <el-input v-model="form.price" type="number" />
          </el-form-item> -->

          <el-form-item label="真实库存:" prop="stock">
            <el-input v-model="form.stock" type="number" />
          </el-form-item>

          <el-row>
            <el-col :span="12">
              <el-form-item label="是否甜酒:">
                <el-select v-model="form.categorySweet" placeholder="选择类别" clearable>
                  <el-option label="甜酒" value="甜酒" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否自然酒:">
                <el-select v-model="form.categoryNatural" placeholder="选择类别" clearable>
                  <el-option label="自然酒" value="自然酒" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="产区中文(搜索):">
                <el-input v-model="form.appellation" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产区英文(搜索):">
                <el-input v-model="form.appellationEn" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="标签:" style="width:100%;" prop="tags">
            <el-tag v-for="tag in form.tags" :key="tag" closable :disable-transitions="false" @close="form.tags.splice(form.tags.indexOf(tag), 1)" style="margin-right:10px;">
              {{ tag }}
            </el-tag>
            <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" size="small" @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" style="width:100px;" />
            <el-button v-else size="small" @click="showInput">
              + 新标签
            </el-button>
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
          <el-row>
            <el-col :span="24">
              <el-form-item label="香气:" style="display:flex;">
                <el-input v-model="form.desc.attrMap.香气" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="甜度:" prop="sweetness">
                <el-select v-model="form.sweetness" placeholder="选择甜度">
                  <el-option label="dry" value="dry" />
                  <el-option label="off_dry" value="off_dry" />
                  <el-option label="medium_sweet" value="medium_sweet" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="酸度:" prop="acidity">
                <el-select v-model="form.acidity" placeholder="选择酸度">
                  <el-option label="低" value="低" />
                  <el-option label="中" value="中" />
                  <el-option label="高" value="高" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单宁:" prop="tannin">
                <el-select v-model="form.tannin" placeholder="选择单宁">
                  <el-option label="低" value="低" />
                  <el-option label="中" value="中" />
                  <el-option label="高" value="高" />
                  <el-option label="无" value="无" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="酒体:" prop="body">
                <el-select v-model="form.body" placeholder="选择酒体">
                  <el-option label="轻盈" value="轻盈" />
                  <el-option label="中等" value="中等" />
                  <el-option label="厚重" value="厚重" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="风格:" prop="style" v-if="form.categoryId != 3">
                <el-select v-model="form.style" placeholder="选择风格">
                  <!-- 白葡萄酒风格 -->
                  <el-option v-show="form.categoryId == 2" label="Refreshing" value="Refreshing" />
                  <el-option v-show="form.categoryId == 2" label="Aromatic" value="Aromatic" />
                  <el-option v-show="form.categoryId == 2" label="creamy" value="creamy" />

                  <!-- 红葡萄酒风格 -->
                  <el-option v-show="form.categoryId == 1" label="Airy" value="Airy" />
                  <el-option v-show="form.categoryId == 1" label="Gentle" value="Gentle" />
                  <el-option v-show="form.categoryId == 1" label="Bold" value="Bold" />

                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="复杂度:" prop="complexity">
                <el-select v-model="form.complexity" placeholder="选择复杂度">
                  <el-option label="Simple" value="Simple" />
                  <el-option label="Intermediate" value="Intermediate" />
                  <el-option label="Complex" value="Complex" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="酒标:" prop="label">
                <el-select v-model="form.label" placeholder="选择送礼倾向">
                  <el-option label="较常规" value="较常规" />
                  <el-option label="独特" value="独特" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="总结:">
                <el-input v-model="form.tastingNote" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" />
              </el-form-item>
            </el-col>
          </el-row>
          <div style="font-weight:700;padding-bottom: 20px;">送礼指标
            <el-switch v-model="slSwitch" @change="slSwitchChange()" />
          </div>
          <div v-show="slSwitch">
            <el-row>
              <el-col :span="8">
                <el-form-item label="送礼场景:">
                  <el-select v-model="form.scene" placeholder="选择场景" multiple>
                    <el-option label="庆祝" value="庆祝" />
                    <el-option label="爱情" value="爱情" />
                    <el-option label="礼物" value="礼物" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="性别:">
                  <el-select v-model="form.gender" placeholder="选择性别" multiple>
                    <el-option label="男" value="男" />
                    <el-option label="女" value="女" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="年龄:">
                  <el-select v-model="form.age" placeholder="选择年龄" multiple>
                    <el-option label="年轻" value="年轻" />
                    <el-option label="年长" value="年长" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="送礼标签:">
                  <el-select v-model="form.tendency" placeholder="选择送礼倾向" multiple>
                    <el-option label="酒标貌美颜值超高" value="酒标貌美颜值超高" />
                    <el-option label="小众宝藏独特" value="小众宝藏独特" />
                    <el-option label="名庄精品佳作" value="名庄精品佳作" />
                    <el-option label="穿越时光的老年份" value="穿越时光的老年份" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">

              </el-col>
            </el-row>
          </div>
        </div>

        <div v-show="active == 3">
          <div style="font-weight:700;padding-bottom: 20px;">酒品特征</div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="品种:">
                <el-input v-model="form.desc.attrMap.品种" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年份:">
                <el-input v-model="form.desc.attrMap.年份" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="地区:" prop="areaList" style="width:96.5%;">
                <el-cascader v-model="form.areaList" :options="address" :props="{'expandTrigger':'hover'}" style="width:100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="产区:">
                <el-input v-model="form.desc.attrMap.产区" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="评分:">
                <el-input v-model="form.desc.attrMap.评分" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="产区英文:">
                <el-input v-model="form.desc.attrMap.产区英文" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产区标签:">
                <el-input v-model="form.desc.attrMap.产区标签" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="酒精度:">
                <el-input v-model="form.desc.attrMap.酒精度"><template #append>%vol</template></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="醒酒时长:">
                <el-input v-model="form.desc.attrMap.醒酒时长" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="饮用温度:">
                <el-select v-model="form.desc.attrMap.饮用温度" placeholder="选择饮用温度">
                  <el-option label="0°C-3°C" value="0°C-3°C" />
                  <el-option label="3°C-7°C" value="3°C-7°C" />
                  <el-option label="7°C-10°C" value="7°C-10°C" />
                  <el-option label="10°C-12°C" value="10°C-12°C" />
                  <el-option label="12°C-15°C" value="12°C-15°C" />
                  <el-option label="15°C-18°C" value="15°C-18°C" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="适用场景:">
                <el-input v-model="form.desc.attrMap.适用场景" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="佐餐建议:">
            <el-input v-model="form.desc.attrMap.佐餐建议" :autosize="{ minRows: 2, maxRows: 6 }" type="textarea" />
          </el-form-item>

          <div style="font-weight:700;padding-bottom: 20px;">酒庄信息</div>
          <el-form-item label="背后故事:">
            <el-input v-model="form.desc.attrMap.背后故事" :autosize="{ minRows: 2, maxRows: 6 }" type="textarea" style="margin-bottom:10px;" />
            <el-upload action="" list-type="picture-card" :file-list="FileList1" :http-request="uploadImgs" :before-remove="beforeRemove1" :on-preview="handlePictureCardPreview" :on-success="handleImgSuccess4">
              <el-icon>
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>

          <el-form-item label="酿造方式:">
            <el-input v-model="form.desc.attrMap.酿造方式" :autosize="{ minRows: 2, maxRows: 6 }" type="textarea" />
          </el-form-item>

          <el-form-item label="产区介绍:">
            <div style="display:flex; width: 100%;">
              <el-upload class="avatar-uploader" action="" :show-file-list="false" :http-request="uploadImgs" :on-success="handleImgSuccess3">
                <img v-if="form.desc.attrMap.产区介绍pic" :src="form.desc.attrMap.产区介绍pic" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
              <el-input v-model="form.desc.attrMap.产区介绍" style="margin-left:10px;padding-bottom: 10px;" type="textarea" />
            </div>
          </el-form-item>

        </div>

      </el-form>

      <div style="text-align:center;margin-top:50px;">
        <el-button v-show="active!=1" @click="active -= 1">上一步</el-button>
        <el-button v-show="active!=3" @click="active += 1">下一步</el-button>
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
      slSwitch: false, //送礼开关
      imgDialogVisible: false, //图片使用
      dialogImageUrl: null, //图片使用
      FileList: [], //图片使用
      FileList1: [], //背后故事图片使用
      form: {
        price: "", //原价
        salesPrice: "", //售价
        stock: "", //真实库存
        title: "", //名字
        titleEn: "", //商品英文名
        categoryId: "", //品类id
        tags: [],
        desc: {
          pics: [],
          descText: "",
          attrMap: {
            香气: "",
            品种: "",
            年份: "",
            产区: "",
            产区英文:"",
            产区标签:"",
            产区介绍pic:"",
            评分: "",
            酒精度: "",
            醒酒时长: "",
            饮用温度: "",
            适用场景: "",
            背后故事: "",
            背后故事pics:[],
            酿造方式: "",
            产区介绍: "",
            佐餐建议: "",
          },
        },
      },
      inputVisible: false, // tag标签使用
      inputValue: "", // tag标签使用
      address: address,
      rules: {
        titleName: [{ required: true, message: "请填写标题", trigger: "blur" }],
        title: [{ required: true, message: "请填写商品名称", trigger: "blur" }],
        code: [{ required: true, message: "请填写商品编码", trigger: "blur" }],
        categoryId: [
          { required: true, message: "请选择类别", trigger: "change" },
        ],
        // price: [{ required: true, message: "请填写原价", trigger: "blur" }],
        salesPrice: [
          { required: true, message: "请填写售价", trigger: "blur" },
        ],
        stock: [{ required: true, message: "请填写真实库存", trigger: "blur" }],
        acidity: [{ required: true, message: "请选择酸度", trigger: "change" }],
        areaList: [
          { required: true, message: "请选择地区", trigger: "change" },
        ],
        body: [{ required: true, message: "请选择酒体", trigger: "change" }],
        sweetness: [
          { required: true, message: "请选择甜度", trigger: "change" },
        ],
        tannin: [{ required: true, message: "请选择单宁", trigger: "change" }],
        style: [{ required: true, message: "请选择风格", trigger: "change" }],
        complexity: [
          { required: true, message: "请选择复杂度", trigger: "change" },
        ],
        relation: [
          { required: true, message: "请填写关系", trigger: "change" },
        ],
        label: [{ required: true, message: "请填写酒标", trigger: "change" }],
        tags: [
          { required: true, message: "至少有一个标签", trigger: "change" },
        ],
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
        "/api-mall/admin/api/v1/products/detail?id=" + this.id
      );
      if (res.data.code === 200) {
        let form = res.data.data;
        form.areaList = [form.country];
        delete form.country;
        delete form.area;
        // delete form.appellation;
        this.FileList = [];
        this.FileList1 = [];
        form.desc.pics.forEach((item) => {
          this.FileList.push({ url: item });
        });
        // 后期增加了pics是个数组，之前数据没有，需要做适配
        if(Array.isArray(form.desc.attrMap.背后故事pics)){
          form.desc.attrMap.背后故事pics.forEach((item) => {
            this.FileList1.push({ url: item });
          });
        }else{
          form.desc.attrMap.背后故事pics = []
        }
        // 送礼指标开关
        if (
          form.scene.length ||
          form.gender.length ||
          form.age.length ||
          form.tendency.length
        ) {
          this.slSwitch = true;
        }
        //库存特殊处理，传stock实际修改的是realStock真实库存，但查询返回来的是realStock，为了回显修改
        form.stock = form.realStock
        delete form.realStock

        this.form = form;
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
    // 添加或更新商品
    async addProduct() {
      this.form.price = this.form.salesPrice //强制原价等于售价
      const res = await this.$request.post(
        this.form.productId
          ? "/api-mall/admin/api/v1/products/modify"
          : "/api-mall/admin/api/v1/products/add",
        this.form
      );
      if (res.data.code === 200) {
        this.$message.success(res.data.message);
        this.$router.back();
      }
    },
    // tag标签使用
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.InputRef.focus();
      });
    },
    // tag标签使用
    handleInputConfirm() {
      if (this.inputValue) {
        this.form.tags.push(this.inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    // 上传图片
    async uploadImgs(option) {
      let formData = new FormData();
      formData.append("file", option.file);
      const res = await this.$request.post(
        "/api-mall/admin/api/v1/products/uploadfile",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data.code === 200) {
        option.onSuccess(res.data.data);
      } else {
        option.onError();
      }
    },
    // 背后故事的图片
    handleImgSuccess1(url) {
      if (url) {
        this.form.desc.attrMap.背后故事pic = url;
      }
    },
    // 产区介绍图片
    handleImgSuccess3(url) {
      if (url) {
        this.form.desc.attrMap.产区介绍pic = url;
      }
    },
    // 背后故事图片
    handleImgSuccess4(url){
      if (url) {
        this.form.desc.attrMap.背后故事pics.push(url);
      }
    },
    // 封面图上传成功后
    handleImgSuccess2(url) {
      if (url) {
        this.form.desc.pics.push(url);
      }
    },
    // 品类改变时候
    formCategoryChange() {
      this.form.style = "";
    },
    //删除图片时前置钩子
    beforeRemove(option) {
      //当删除图片时候也应该移除表单中对应的图片
      let index = this.FileList.indexOf(option);
      this.form.desc.pics.splice(index, 1);
      return true;
    },
    //删除图片时前置钩子
    beforeRemove1(option) {
      //当删除图片时候也应该移除表单中对应的图片
      let index = this.FileList1.indexOf(option);
      this.form.desc.attrMap.背后故事pics.splice(index, 1);
      return true;
    },
    // 放大图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.imgDialogVisible = true;
    },
    // 送礼指标开关改变
    slSwitchChange() {
      if (!this.slSwitch) {
        //如果关闭
        this.form.scene = [];
        this.form.gender = [];
        this.form.age = [];
        this.form.tendency = [];
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
</style>