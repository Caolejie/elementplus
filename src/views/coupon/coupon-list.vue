<template>
  <div style="height:100%;display:flex;flex-direction:column;">
    <div>
      <el-button type="primary" @click="$router.push('/coupon/info')">新建优惠券</el-button>
    </div>

    <!-- 查询区域 -->
    <el-card shadow="never" style="margin: 10px 0;">
      <el-form :model="search">
        <el-row :gutter="30">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="优惠券ID:">
              <el-input v-model="search.couponTemplateId" placeholder="请输入优惠券ID" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="优惠券名称:">
              <el-input v-model="search.keyword" placeholder="请输入优惠券名称" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="优惠券种类:">
              <el-select v-model="search.isCombos" placeholder="请选择优惠券种类" style="width:100%;" clearable>
                <el-option label="商品券" value="combo_coupon" />
                <el-option label="店铺券" value="shop_coupon" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="兑换密令:">
              <el-input v-model="search.couponCode" placeholder="请输入兑换密令" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="限定人群:">
              <el-select v-model="search.exclusively" placeholder="请选择限定人群" style="width:100%;" clearable>
                <el-option label="所有用户" value="any" />
                <el-option label="新用户" value="new" />
                <el-option label="老用户" value="old" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="发放方式:">
              <el-select v-model="search.getType" placeholder="请选择发放方式" style="width:100%;" clearable>
                <el-option label="自动发放" value="auto" />
                <el-option label="手动领取" value="manual" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="优惠类型:">
              <el-select v-model="search.type" placeholder="请选择优惠类型" style="width:100%;" clearable>
                <el-option label="满减" value="full_reduction" />
                <el-option label="折扣" value="discount" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="适用商品:">
              <el-select v-model="search.productIds" placeholder="请选择适用的商品" filterable multiple style="width:100%;">
                <el-option :label="pItem.productId + ' - ' + pItem.title" :value="pItem.productId"
                  v-for="pItem in products" :key="pItem.productId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align: right;">
        <el-button type="primary" @click="getCouponList()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
      </div>

    </el-card>

    <!-- 表格区域 -->
    <el-table :data="tableList" style="flex:1;" v-loading="loading">
      <el-table-column prop="couponTemplateId" label="ID" width="60" />
      <el-table-column prop="name" label="优惠券名称" />
      <el-table-column label="种类" width="70">
        <template #default="scope">
          {{ getText(scope.row.isCombos) }}
        </template>
      </el-table-column>
      <el-table-column label="已领/总数" width="100">
        <template #default="scope">
          {{ scope.row.availableNums }} / {{ scope.row.quantityNums }}
        </template>
      </el-table-column>
      <el-table-column label="优惠类型" width="60">
        <template #default="scope">
          {{ getText(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="satisfyNum" label="满足金额" width="60" />
      <el-table-column prop="minusNum" label="减免金额" width="60" />
      <el-table-column label="限定人群" width="90">
        <template #default="scope">
          {{ getText(scope.row.exclusively) }}
        </template>
      </el-table-column>
      <el-table-column label="发放方式" width="90">
        <template #default="scope">
          {{ getText(scope.row.getType) }}
        </template>
      </el-table-column>
      <el-table-column prop="usableTimes" label="单用户可领取次数" width="80" />
      <el-table-column prop="visibleTime" label="领取后有效天数" width="80" />
      <el-table-column label="可使用期限" width="180">
        <template #default="scope">
          {{ scope.row.startTime }} - {{ scope.row.endTime }}
        </template>
      </el-table-column>
      <el-table-column prop="couponCode" label="兑换密令" />
      <el-table-column label="可领取期限" width="180">
        <template #default="scope">
          {{ scope.row.getStartTime }} - {{ scope.row.getEndTime }}
        </template>
      </el-table-column>

      <el-table-column label="领取状态" width="90">
        <template #default="scope">
          <template v-if="scope.row.status == 'receiving'">
            <i
              style="display: inline-block; background-color: #67C23A; width: 10px; height: 10px;border-radius: 50%;"></i>
            {{ getText(scope.row.status) }}
          </template>
          <template v-else>
            <i
              style="display: inline-block; background-color: #909399; width: 10px; height: 10px;border-radius: 50%;"></i>
            {{ getText(scope.row.status) }}
          </template>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="190">
        <template #default="scope">
          <el-dropdown style="vertical-align: baseline;" trigger="click">
            <el-button link type="primary" size="small" style="margin-right:12px;">分享</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="getCouponUrl(scope.row.uuid)">复制链接</el-dropdown-item>
                <el-dropdown-item @click="downloadQr(scope.row.uuid)">下载二维码</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button link type="primary" size="small"
            @click="$router.push(`/coupon/info?id=${scope.row.couponTemplateId}&copy=1`)">复制</el-button>
          <el-button link type="primary" size="small"
            @click="$router.push(`/coupon/info?id=${scope.row.couponTemplateId}`)">编辑</el-button>
          <el-popconfirm title="禁领成功后不能再启用！" @confirm="deleteItem(scope.row.couponTemplateId)">
            <template #reference>
              <el-button link type="primary" size="small">禁领</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-box">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next" :total="totalNum" :currentPage="search.page" :pageSize="search.size">
      </el-pagination>
    </div>
  </div>




</template>

<script>
import sDrawer from "@/components/s-drawer/s-drawer.vue"
export default {
  components: {
    sDrawer,
  },
  watch: {

  },
  data() {
    return {
      loading: false,
      totalNum: 0,
      search: {
        page: 1,
        size: 20,
      },
      form: {},
      tableList: [],
      products: [],
    }
  },
  created() {
    this.getCouponList()
    this.getProductList()
  },
  computed: {
    // type获取题目类型文本
    getText() {
      return (text) => {
        if (text == "full_reduction") {
          return "满减"
        } else if (text == "discount") {
          return "折扣"
        } else if (text == "any") {
          return "所有用户"
        } else if (text == "new") {
          return "新用户"
        } else if (text == "old") {
          return "老用户"
        } else if (text == "auto") {
          return "自动发放"
        } else if (text == "manual") {
          return "手动领取"
        } else if (text == "shop_coupon") {
          return "店铺券"
        } else if (text == "combo_coupon") {
          return "商品券"
        } else if (text == "receiving") {
          return "领取中"
        } else if (text == "closed") {
          return "已结束"
        } else if (text == "disabled") {
          return "已禁用"
        } else if (text == "wait_start") {
          return "未开始"
        } else {
          return text
        }
      }
    },
  },
  methods: {
    // 查询优惠券列表
    async getCouponList() {
      this.loading = true
      const res = await this.$request.post("/api-mall/admin/api/v1/couponTemplate/list", this.search)
      if (res.data.code === 200) {
        this.tableList = res.data.data.list
        this.totalNum = res.data.data.total
      }
      this.loading = false
    },
    // 获取商品列表
    async getProductList() {
      const res = await this.$request.post("/api-mall/admin/api/v1/products/list", { page: 1, size: 1000 })
      if (res.data.code === 200) {
        this.products = res.data.data.list
      }
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.search.size = val
      this.getCouponList()
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.search.page = val
      this.getCouponList()
    },
    // 点击删除
    async deleteItem(id) {
      const res = await this.$request.get("/api-mall/admin/api/v1/couponTemplate/remove?couponTemplateId=" + id)
      if (res.data.code === 200) {
        this.$message.success(res.data.message)
        this.getCouponList()
      }
    },
    // 搜索重置
    resetSearch() {
      let search = {
        page: this.search.page,
        size: this.search.size,
      };
      this.search = search
      this.getCouponList()
    },
    // 下载小程序二维码
    async downloadQr(id) {
      const res = await this.$request.post("/api-mall/admin/api/v1/couponTemplate/qr-code", {
        page: "pages/couponsLink/couponsLink",
        scene: id,
      });
      if (res.data.code === 200) {
        let base64Str = "data:image/jpeg;base64," + res.data.data;
        let aLink = document.createElement("a");
        aLink.style.display = "none";
        aLink.href = base64Str;
        aLink.download = `${id}.jpg`;
        // 触发点击-然后移除
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink);
      }
    },
    async getCouponUrl(id) {
      const res = await this.$request.get("/api-mall/admin/api/v1/couponTemplate/getCouponUrl?targetUrl=pages/couponsLink/couponsLink?scene=" + id)
      if (res.data.code === 200) {
        navigator.clipboard.writeText(res.data.data).then(() => {
          this.$message.success('复制成功，链接30天内有效！')
        })
      }
    }
  }
}
</script>

<style scoped>
.pagination-box {
  background-color: #fff;
  display: flex;
  justify-content: flex-end;
  padding: 5px 0;
}
</style>