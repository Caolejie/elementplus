<template>
  <div style="height:100%;display:flex;flex-direction:column;">
    <div>
      <el-button type="primary" @click="$router.push('/point/product-info')">新建商品</el-button>
    </div>

    <!-- 查询区域 -->
    <el-card shadow="never" style="margin: 10px 0;">
      <el-form :model="search">
        <el-row :gutter="30">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="商品ID:">
              <el-input v-model="search.productId" placeholder="请输入商品ID" disabled />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="商品名称:">
              <el-input v-model="search.name" placeholder="请输入商品名称" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="商品类型:">
              <el-select v-model="search.type" placeholder="请选择商品类型" style="width:100%;" clearable disabled>
                <el-option label="实体商品" value="real" />
                <el-option label="虚拟商品" value="virtual" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="商品状态:">
              <el-select v-model="search.isCombos" placeholder="请选择商品状态" style="width:100%;" clearable disabled>
                <el-option label="商品券" value="combo_coupon" />
                <el-option label="店铺券" value="shop_coupon" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align: right;">
        <el-button type="primary" @click="getProductList()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
      </div>

    </el-card>

    <!-- 表格区域 -->
    <el-table :data="tableList" style="flex:1;" v-loading="loading">
      <el-table-column prop="productId" label="ID" width="60" />
      <el-table-column prop="name" label="商品名称" />
      <el-table-column label="商品类型">
        <template #default="scope">{{ scope.row.type == 'real' ? '实体商品' : '虚拟商品' }}</template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" />
      <el-table-column prop="limitNum" label="单人限购" />
      <el-table-column prop="requiredPoints" label="原有积分" />
      <el-table-column prop="payPoints" label="实付积分" />
      <el-table-column label="状态">
        <template #default="scope">
          <template v-if="scope.row.status == 'saleable'">
            <i
              style="display: inline-block; background-color: #67C23A; width: 10px; height: 10px;border-radius: 50%;"></i>
            已上架
          </template>
          <template v-else>
            <i
              style="display: inline-block; background-color: #909399; width: 10px; height: 10px;border-radius: 50%;"></i>
            已下架
          </template>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="140">
        <template #default="scope">
          <el-popconfirm title="确定要上架该商品吗?" @confirm="clickSaleable(scope.row.productId, 'saleable')"
            v-if="scope.row.status == 'unsaleable'">
            <template #reference>
              <el-button link type="primary" size="small">上架</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm title="确定要下架该商品吗?" @confirm="clickSaleable(scope.row.productId, 'unsaleable')" v-else>
            <template #reference>
              <el-button link type="primary" size="small">下架</el-button>
            </template>
          </el-popconfirm>

          <el-button link type="primary" size="small"
            @click="$router.push(`/point/product-info?id=${scope.row.productId}`)">编辑</el-button>

          <el-popconfirm title="确定要删除吗？" @confirm="deleteItem(scope.row.productId)">
            <template #reference>
              <el-button link type="primary" size="small">删除</el-button>
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
export default {
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
    this.getProductList()
  },
  computed: {
    // type获取题目类型文本
    getText() {
      return (text) => {
        if (text == "full_reduction") {
          return "满减"
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
    async getProductList() {
      this.loading = true
      const res = await this.$request.post("/api-member/admin/api/v1/sys/product/list", this.search)
      if (res.data.code === 200) {
        this.tableList = res.data.data.records
        this.totalNum = res.data.data.total
      }
      this.loading = false
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.search.size = val
      this.getProductList()
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.search.page = val
      this.getProductList()
    },
    // 点击删除
    async deleteItem(id) {
      const res = await this.$request.post("/api-member/admin/api/v1/sys/product/del", [id])
      if (res.data.code === 200) {
        this.$message.success(res.data.message)
        this.getProductList()
      }
    },
    // 搜索重置
    resetSearch() {
      let search = {
        page: this.search.page,
        size: this.search.size,
      };
      this.search = search
      this.getProductList()
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
    },
    // 上下架商品
    async clickSaleable(id, status) {
      const res = await this.$request.get("/api-member/admin/api/v1/sys/product/status",{params:{
        id,
        status
      }})
      if (res.data.code === 200) {
        this.$message.success(res.data.message);
        this.getProductList();
      }
    },
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