<template>
  <el-page-header content="订单详情" @back="$router.back()" style="margin-bottom:10px;" />
  <el-card shadow="never">
    <el-descriptions title="基本信息" border>
      <el-descriptions-item label="订单编号">{{orderInfo.oid}}</el-descriptions-item>
      <el-descriptions-item label="下单时间">{{orderInfo.createTime}}</el-descriptions-item>
      <el-descriptions-item label="更新时间">{{orderInfo.updateTime}}</el-descriptions-item>
      <el-descriptions-item label="订单金额">{{orderInfo.price}}</el-descriptions-item>
      <el-descriptions-item label="应付金额">{{orderInfo.payment}}</el-descriptions-item>
      <el-descriptions-item label="订单状态">{{getStatusText(orderInfo.status)}}</el-descriptions-item>
    </el-descriptions>
    <el-divider></el-divider>
    <!-- <el-descriptions title="优惠信息" border>
      <el-descriptions-item label="优惠券名称">啊伤心啊是</el-descriptions-item>
      <el-descriptions-item label="优惠券金额">都是错的事情我</el-descriptions-item>
    </el-descriptions> -->
    <el-descriptions title="用户信息" border v-if="orderInfo.orderAddress">
      <el-descriptions-item label="用户ID"><el-button link type="primary" size="small" @click="$router.push(`/user/info?id=${orderInfo.orderAddress.userId}`)">{{orderInfo.orderAddress.userId}}</el-button></el-descriptions-item>
      <el-descriptions-item label="收货电话">{{orderInfo.orderAddress.receiverPhone}}</el-descriptions-item>
      <el-descriptions-item label="收货地址">{{`${orderInfo.orderAddress.receiverProvince} ${orderInfo.orderAddress.receiverCity} ${orderInfo.orderAddress.receiverArea} ${orderInfo.orderAddress.receiverAddress}`}}</el-descriptions-item>
    </el-descriptions>
    <el-divider></el-divider>

    <!-- <el-card shadow="never" style="margin-top:10px;" v-if="orderInfo.orderCombos"> -->
      <div class="el-descriptions__header el-descriptions__title">商品列表</div>
      <el-table :data="orderInfo.orderCombos" stripe border>
        <el-table-column label="商品图片">
          <template #default="scope">
            <el-image style="width: 60px; height: 80px" :src="scope.row.combos.productsList[0].desc.pics[0]" />
          </template>
        </el-table-column>
        <el-table-column label="商品名称">
          <template #default="scope">
            {{scope.row.combos.productsList[0].title}}
          </template>
        </el-table-column>
        <el-table-column prop="num" label="数量" />
        <el-table-column prop="realPrice" label="价格" />
      </el-table>
    <!-- </el-card> -->
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
      this.getOrderInfo();
    }
  },
  methods: {
    // 查询订单详情
    async getOrderInfo() {
      const res = await this.$request.get(
        "/api-mall/admin/api/v1/order/find_order_info?orderId=" + this.$route.query.id
      );
      if (res.data.code === 200) {
        this.orderInfo = res.data.data;
      }
    },
    getStatusText(value) {
      if (value == "create" || value == "paying") {
        return "待付款";
      } else if (value == "pushed") {
        return "已推送至erp";
      } else if (value == "paid") {
        return "待发货";
      } else if (value == "shipped") {
        return "已发货";
      } else if (value == "finished") {
        return "已完成";
      } else if (value == "refunded") {
        return "已退款";
      } else if (value == "request_refund") {
        return "退款中";
      } else if (value == "unpaid_over_time") {
        return "超时未支付";
      } else {
        return value;
      }
    },
  },
};
</script>