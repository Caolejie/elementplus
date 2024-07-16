<template>
  <el-page-header content="积分订单详情" @back="$router.back()" style="margin-bottom:10px;" />
  <el-card shadow="never">
    <el-descriptions title="基本信息" border>
      <el-descriptions-item label="订单ID">{{ orderInfo.orderId }}</el-descriptions-item>
      <el-descriptions-item label="会员ID">{{ orderInfo.memberId }}</el-descriptions-item>
      <el-descriptions-item label="下单时间">{{ orderInfo.createTime }}</el-descriptions-item>
      <el-descriptions-item label="更新时间">{{ orderInfo.updateTime }}</el-descriptions-item>
      <el-descriptions-item label="标价积分">{{ orderInfo.price }} 分</el-descriptions-item>
      <el-descriptions-item label="实付积分">{{ orderInfo.payment }} 分</el-descriptions-item>
      <el-descriptions-item label="订单状态">{{ getStatusText(orderInfo.status) }}</el-descriptions-item>
    </el-descriptions>
    <el-divider></el-divider>
    <div class="el-descriptions__header el-descriptions__title">商品列表</div>
    <el-table :data="orderInfo.productNumVOList" stripe border>
      <el-table-column label="商品图片">
        <template #default="scope">
          <el-image style="width: 60px; height: 80px" :src="scope.row.product.cover" />
        </template>
      </el-table-column>
      <el-table-column label="商品名称">
        <template #default="scope">
          {{ scope.row.product.name }}
        </template>
      </el-table-column>
      <el-table-column prop="productNum" label="数量" />
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      orderInfo: {},
    };
  },
  created() {
    if (this.$route.query.id) {
      this.getOrderInfo()
    }
  },
  methods: {
    // 查询订单详情
    async getOrderInfo() {
      const res = await this.$request.get(
        "/api-member/admin/api/v1/sys/member-order/get_order_info?orderId=" + this.$route.query.id
      )
      if (res.data.code === 200) {
        this.orderInfo = res.data.data
      }
    },
    getStatusText(value) {
      if (value == "rollback") {
        return "已取消"
      } else if (value == "finished") {
        return "已完成"
      } else {
        return value
      }
    },
  },
};
</script>