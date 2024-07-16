<template>
  <div style="height:100%;display:flex;flex-direction:column;">

    <!-- 查询区域 -->
    <!-- <el-card shadow="never" style="margin: 10px 0;">
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
        <el-button type="primary" @click="getOrderList()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
      </div>

    </el-card> -->

    <!-- 表格区域 -->
    <el-table :data="tableList" style="flex:1;" v-loading="loading">
      <el-table-column prop="orderId" label="订单ID" />
      <el-table-column prop="memberId" label="会员ID" />
      <el-table-column prop="price" label="标价积分" />
      <el-table-column prop="payment" label="实付积分" />
      <el-table-column label="兑换状态">
        <template #default="scope">{{ scope.row.status == 'finished' ? '已完成'  : '已取消' }}</template>
      </el-table-column>
      <el-table-column prop="payTime" label="兑换时间" width="175" />


      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-button link type="primary" size="small"
            @click="$router.push(`/point/order-info?id=${scope.row.orderId}`)">详情</el-button>
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
    this.getOrderList()
  },
  methods: {
    // 查询优惠券列表
    async getOrderList() {
      this.loading = true
      const res = await this.$request.post("/api-member/admin/api/v1/sys/member-order/get_order_list", this.search)
      if (res.data.code === 200) {
        this.tableList = res.data.data.list
        this.totalNum = res.data.data.total
      }
      this.loading = false
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.search.size = val
      this.getOrderList()
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.search.page = val
      this.getOrderList()
    },
    // 点击删除
    async deleteItem(id) {
      const res = await this.$request.post("/api-member/admin/api/v1/sys/product/del", [id])
      if (res.data.code === 200) {
        this.$message.success(res.data.message)
        this.getOrderList()
      }
    },
    // 搜索重置
    resetSearch() {
      let search = {
        page: this.search.page,
        size: this.search.size,
      };
      this.search = search
      this.getOrderList()
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