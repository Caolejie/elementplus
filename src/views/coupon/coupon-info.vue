<template>
  <el-page-header :content="form.couponTemplateId ? '编辑优惠券' : '新建优惠券'" @back="$router.back()"
    style="margin-bottom:10px;" />
  <el-card shadow="never" style="padding:0 90px;" v-loading="loading">
    <div class="content-box">
      <el-form :model="form" label-width="120px" ref="ruleFormRef" :rules="rules">

        <el-form-item label="优惠券种类:" prop="isCombos">
          <el-radio-group v-model="form.isCombos" @change="isCombosChange()" :disabled="disabled">
            <el-radio label="combo_coupon">商品券</el-radio>
            <el-radio label="shop_coupon">店铺券</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择商品:" v-if="form.isCombos == 'combo_coupon'">
          <el-select v-model="form.canUseProductIds" placeholder="请选择优惠的商品" filterable multiple style="width:100%;" :disabled="disabled">
            <el-option :label="pItem.productId + ' - ' + pItem.title" :value="pItem.productId" v-for="pItem in products"
              :key="pItem.productId" />
          </el-select>
        </el-form-item>

        <div class="row-title">基本设置</div>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="优惠券名称:" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优惠券描述:">
              <el-input v-model="form.describe" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="有效期限制:" prop="dateDay">
          <div>
            <el-radio-group v-model="form.dateDay" @change="dateDayChange()" :disabled="disabled">
              <el-radio label="date">限制可用时间</el-radio>
              <el-radio label="day">领后有效天数</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="使用时间:" v-if="form.dateDay == 'date'">
          <el-date-picker v-model="dateModel" value-format="YYYY-MM-DD HH:mm:ss" type="datetimerange"
            start-placeholder="开始使用时间" end-placeholder="使用结束时间" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="领取后有效天数:" v-if="form.dateDay == 'day'">
          <el-input v-model="form.visibleTime" :disabled="disabled" />
        </el-form-item>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="发放数量:" prop="quantityNums">
              <el-input v-model="form.quantityNums" type="number" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单人领取限制:" prop="usableTimes">
              <el-input v-model="form.usableTimes" type="number" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="限定人群:" prop="exclusively">
          <el-select v-model="form.exclusively" placeholder="请选择限定人群" :disabled="disabled">
            <el-option label="所有用户" value="any" />
            <el-option label="新用户" value="new" />
            <el-option label="老用户" value="old" />
          </el-select>
        </el-form-item>

        <div class="row-title">优惠设置</div>
        <el-form-item label="优惠类型:" prop="type">
          <el-select v-model="form.type" placeholder="请选择优惠类型" :disabled="disabled">
            <el-option label="满减" value="full_reduction" />
            <el-option label="折扣" value="discount" />
          </el-select>
        </el-form-item>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="满足金额:" prop="satisfyNum">
              <el-input v-model="form.satisfyNum" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="减x/折扣:" prop="minusNum">
              <el-input v-model="form.minusNum" :disabled="disabled" />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="row-title">发放设置</div>
        <el-form-item label="发放方式:">
          <el-radio-group v-model="form.getType" :disabled="disabled">
            <el-radio label="auto">自动发放</el-radio>
            <el-radio label="manual">手动领取</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="兑换密令:">
          <el-switch v-model="hasCouponCode" @change="hasCouponCodeChange()" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="设置密令:" v-if="hasCouponCode">
          <el-input v-model="form.couponCode" clearable :disabled="disabled">
            <template #append>
              <el-button @click="form.couponCode = uuid()" :disabled="disabled">随机</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="详情页展示入口:" v-if="form.isCombos == 'combo_coupon'">
          <el-switch v-model="form.isVisible" active-value="visible" inactive-value="invisible" :disabled="disabled" />
        </el-form-item>

        <div class="row-title">领取时间设置</div>

        <el-form-item label="领取时间:">
          <el-date-picker v-model="getDateModel" value-format="YYYY-MM-DD HH:mm:ss" type="datetimerange"
            start-placeholder="开始领取时间" end-placeholder="领取结束时间" />
        </el-form-item>

      </el-form>
      <div style="text-align: center;">
        <el-button type="primary" @click="formValidate()">保存</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      disabled:false,
      hasCouponCode:false,
      loading: false,
      dateModel: [], //可用时间
      getDateModel: [], //领取时间
      form: {},
      rules: {
        name: [{ required: true, message: "请填写优惠券名称", trigger: "blur" }],
        isCombos: [{ required: true, message: "请选择优惠券种类", trigger: "change" }],
        dateDay: [{ required: true, message: "请选择有效期限制", trigger: "change" }],
        exclusively: [{ required: true, message: "请选择限定人群", trigger: "change" }],
        type: [{ required: true, message: "请选择优惠类型", trigger: "change" }],
        satisfyNum: [{ required: true, message: "请填写满足金额", trigger: "blur" }],
        minusNum: [{ required: true, message: "请填写减x/折扣", trigger: "blur" }],
        quantityNums: [{ required: true, message: "请填写发放数量", trigger: "blur" }],
        usableTimes: [{ required: true, message: "请填写单人领取限制", trigger: "blur" }],
        getDateModel: [{ required: true, message: "请设置领取时间", trigger: "change" }],
      },
      products: [],
    }
  },
  watch: {
    dateModel(value) {
      if (value) {
        this.form.startTime = value[0];
        this.form.endTime = value[1];
      } else {
        delete this.form.startTime;
        delete this.form.endTime;
      }
    },
    getDateModel(value) {
      if (value) {
        this.form.getStartTime = value[0];
        this.form.getEndTime = value[1];
      } else {
        delete this.form.getStartTime;
        delete this.form.getEndTime;
      }
    },
  },
  created() {
    if (this.$route.query.id) {
      this.getCouponInfo()
    }
    this.getProductList()
  },
  methods: {
    // 查单条优惠券信息
    async getCouponInfo(id) {
      this.loading = true
      const res = await this.$request.get("/api-mall/admin/api/v1/couponTemplate/find_coupon_by_id?couponTemplateId=" + this.$route.query.id)
      if (res.data.code === 200) {
        this.dateModel = [res.data.data.startTime, res.data.data.endTime]
        this.getDateModel = [res.data.data.getStartTime, res.data.data.getEndTime]
        this.form = res.data.data
        if(this.form.couponCode){ //回显兑换密令开关
          this.hasCouponCode = true
        }
        if (this.$route.query.copy == 1) {
          delete this.form.couponTemplateId
        }
        if(this.form.couponTemplateId){ //设置禁止编辑
          this.disabled = true
        }
      }
      this.loading = false
    },
    // 生成uuid
    uuid() {
      return "xxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
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
      let url = this.form.couponTemplateId ? "/api-mall/admin/api/v1/couponTemplate/modify" : "/api-mall/admin/api/v1/couponTemplate/add"
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
    // 获取商品列表
    async getProductList() {
      const res = await this.$request.post("/api-mall/admin/api/v1/products/list", { page: 1, size: 1000 })
      if (res.data.code === 200) {
        this.products = res.data.data.list
      }
    },
    // 优惠种类改变
    isCombosChange(){
      if(this.form.isCombos == 'shop_coupon'){
        // 如果选择了店铺券
        delete this.form.canUseProductIds //优惠商品数组[]
        delete this.form.isVisible //详情页展示入口
      }
    },
    // 有效期限制改变
    dateDayChange(){
      if(this.form.dateDay === 'day'){
        // 如果选择的是领取后有效天数
        this.dateModel = []
      }else{
        // 否则为限制可用时间
        delete this.form.visibleTime
      }
    },
    // 兑换密令开关
    hasCouponCodeChange(){
      if(!this.hasCouponCode){
        delete this.form.couponCode
      }
    }
  }
}
</script>

<style scoped>
.content-box {
  width: 1000px;
  margin: 0 auto;
}

.row-title {
  font-weight: 700;
  padding-bottom: 20px;
}
</style>