<template>
  <el-page-header :content="form.productId ? '编辑积分商品' : '新增积分商品'" @back="$router.back()" style="margin-bottom:10px;" />
  <el-card shadow="never" style="padding:0 90px;" v-loading="loading">
    <el-steps :active="active" align-center style="margin:20px auto;">
      <el-step title="填写商品基本信息" />
      <el-step title="填写商品详细信息" />
    </el-steps>
    <el-form :model="form" label-width="120px" ref="ruleFormRef" :rules="rules">
      <div v-show="active == 1">
        <el-form-item label="商品名称:">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="商品描述:">
          <el-input v-model="form.remark" />
        </el-form-item>
        <el-form-item label="商品类型:">
          <el-select v-model="form.type" placeholder="请选择商品类型">
            <el-option label="实体商品" value="real" />
            <el-option label="虚拟商品" value="virtual" />
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券:" v-if="form.type == 'virtual'">
          <el-select v-model="form.cdKey" filterable remote reserve-keyword placeholder="输入优惠券ID进行搜索"
            :remote-method="remoteMethod" :loading="loadingSelect" style="width:100%">
            <el-option v-for="cItem in couponList" :key="cItem.couponTemplateId" :label="cItem.couponTemplateId + ' - ' + cItem.name"
              :value="cItem.uuid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属类目:">
          <el-select v-model="form.category" placeholder="请选择所属类目">
            <el-option v-for="(cItem, cIndex) in categoryList" :key="cIndex" :label="cItem.categoryName"
              :value="cItem.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="原价积分:">
          <el-input v-model="form.requiredPoints" type="number" />
        </el-form-item>
        <el-form-item label="现价积分:">
          <el-input v-model="form.payPoints" type="number" />
        </el-form-item>
        <el-form-item label="人民币价值:">
          <el-input v-model="form.rmbPrice" />
        </el-form-item>
        <el-form-item label="库存:" prop="stock">
          <el-input v-model="form.stock" />
        </el-form-item>
        <el-form-item label="是否上架:">
          <el-switch v-model="form.status" active-value="saleable" inactive-value="unsaleable" />
        </el-form-item>
        <el-form-item label="单人限购数:">
          <el-input v-model="form.limitNum" type="number" />
        </el-form-item>
        <el-form-item label="封面图:">
          <uploadImage v-model="form.cover"></uploadImage>
        </el-form-item>
        <el-form-item label="轮播图:">
          <uploadPics v-model="form.pics"></uploadPics>
        </el-form-item>
      </div>
      <div v-show="active == 2">
        <el-collapse>
          <el-collapse-item :title="aItem.title ? aItem.title : `段落${aIndex + 1}`" :name="aIndex + 1"
            v-for="(aItem, aIndex) in form.description.details" :key="aIndex">
            <el-form-item label="段落标题:">
              <el-input v-model="aItem.title" />
            </el-form-item>


            <el-form-item v-for="(cItem, cIndex) in aItem.content" :key="cIndex" style="margin-bottom:10px;">
              <template v-if="cItem.type == 'text'">
                <el-input v-model="cItem.text" :autosize="{ minRows: 2, maxRows: 6 }" type="textarea" style="width:80%;"
                  placeholder="请输入内容" />
              </template>
              <template v-if="cItem.type == 'image'">
                <uploadImage v-model="cItem.image"></uploadImage>
              </template>
              <el-button type="danger" @click="aItem.content.splice(cIndex, 1)" style="margin-left:20px;">删除</el-button>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="aItem.content.push({ 'type': 'text' })">文本</el-button>
              <el-button type="primary" @click="aItem.content.push({ 'type': 'image' })">图片</el-button>
              <el-button type="danger" @click="form.description.details.splice(aIndex, 1)">删除段落</el-button>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>

        <div style="text-align:right;margin-top:50px;">
          <el-button type="primary" @click="form.description.details.push({ 'content': [] })" style="text-align:right;">
            增加段落
          </el-button>
        </div>
      </div>
    </el-form>

    <div style="text-align:center;margin-top:50px;">
      <el-button v-show="active != 1" @click="active -= 1">上一步</el-button>
      <el-button v-show="active != 2" @click="active += 1">下一步</el-button>
      <el-button type="primary" @click="formValidate()">保存</el-button>
    </div>
  </el-card>
</template>

<script>
import uploadImage from "@/components/upload-image/upload-image.vue"
import uploadPics from "@/components/upload-pics/upload-pics.vue"
export default {
  components: {
    uploadImage,
    uploadPics
  },
  data() {
    return {
      active: 1,
      loading: false,
      loadingSelect: false,
      form: {
        description: {
          details: [{ content: [] }], //商品详情及属性
        },
      },
      rules: {
        name: [{ required: true, message: "请填写积分商品名称", trigger: "blur" }],
        isCombos: [{ required: true, message: "请选择积分商品种类", trigger: "change" }],
      },
      categoryList: [],
      couponList: [],
    }
  },
  watch: {
  },
  created() {
    if (this.$route.query.id) {
      this.getProductInfo()
    }
    this.getAllCategory()
  },
  methods: {
    // 查单条积分商品信息
    async getProductInfo(id) {
      this.loading = true
      const res = await this.$request.get("/api-member/admin/api/v1/sys/product/detail?id=" + this.$route.query.id)
      if (res.data.code === 200) {
        this.form = res.data.data
      }
      this.loading = false
    },
    // 查询所有类目
    async getAllCategory() {
      const res = await this.$request.post("/api-member/admin/api/v1/sys/memberMallCategory/list", { page: 1, size: 1000 })
      if (res.data.code === 200) {
        this.categoryList = res.data.data.records
      }
    },
    // 远程搜索
    async remoteMethod(query) {
      this.loadingSelect = true
      if (query) {
        const res = await this.$request.post("/api-mall/admin/api/v1/couponTemplate/list", { page: 1, size: 1000, couponTemplateId: query })
        if (res.data.code === 200) {
          this.couponList = res.data.data.list
        }
      } else {
        this.couponList = []
      }
      this.loadingSelect = false
    },
    //表单校验
    formValidate() {
      this.$refs.ruleFormRef.validate((valid) => {
        if (valid) {
          //表单校验成功
          this.saveCoupon()
        }
      });
    },
    // 点击保存
    async saveCoupon() {
      let url = this.form.productId ? "/api-member/admin/api/v1/sys/product/modify" : "/api-member/admin/api/v1/sys/product/add"
      const res = await this.$request.post(url, this.form)
      if (res.data.code === 200) {
        this.$message.success(res.data.message)
        this.$router.back()
      } else {
        for (const key in res.data.data) {
          this.$message.warning(res.data.data[key])
        }
      }
    },
  }
}
</script>

<style scoped>

</style>