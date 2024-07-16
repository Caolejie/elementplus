<template>
  <el-card shadow="never" style="margin: 10px 0;">
    <el-row :gutter="30">
      <el-col :span="8">
        <el-form-item label="订单ID:" style="margin-bottom: 0;">
          <el-input v-model="search.oid" placeholder="请输入订单ID" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="用户ID:" style="margin-bottom: 0;">
          <el-input v-model="search.userId" placeholder="请输入用户ID" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="订单状态:" style="margin-bottom: 0;">
          <el-select v-model="search.status" placeholder="请选择订单状态" style="width:100%;" multiple>
            <el-option label="创建" value="CREATE" />
            <el-option label="超时" value="UNPAID_OVER_TIME" />
            <el-option label="支付中" value="PAYING" />
            <el-option label="待发货" value="PAID" />
            <el-option label="申请退款" value="REQUEST_REFUND" />
            <el-option label="已退款" value="REDUNDED" />
            <el-option label="已发货" value="SHIPPED" />
            <el-option label="已完成" value="FINISHED" />
            <el-option label="推送erp" value="PUSHED" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="30">
      <el-col :span="16">
        <el-form-item label="创建时间:" style="margin-bottom: 0;">
          <el-date-picker size="small" v-model="date" @change="dataChange" value-format="YYYY-MM-DD HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:100%;"></el-date-picker>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-button type="primary" @click="getOrderList()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
      </el-col>
    </el-row>
  </el-card>
  <el-card>
    <el-button :disabled="totalNum > 10000" :loading="exportLoading" type="primary" @click="exportExcel()" size="small" style="margin-bottom:10px;">导出 {{totalNum}} 条数据</el-button>
    <el-table :data="tableData" stripe>
      <el-table-column prop="oid" label="订单ID" width="200" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="payment" label="支付价格" />
      <el-table-column prop="price" label="原价" />
      <el-table-column label="订单状态">
        <template #default="scope">
          {{this.getStatusText(scope.row.status)}}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="payTime" label="支付时间" /> -->
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="updateTime" label="更新时间" width="180" />

      <el-table-column fixed="right" label="操作" width="130">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="goOrderInfoPage(scope.row.orderId)">详情</el-button>

          <el-popconfirm title="确定要操作退款吗?" @confirm="refundOrder(scope.row.orderId)" v-if="scope.row.status != 'refunded' && scope.row.status != 'unpaid_over_time'">
            <template #reference>
              <el-button link type="primary" size="small">退款</el-button>
            </template>
          </el-popconfirm>

          <el-popconfirm title="确定要操作审核吗?" @confirm="sendOrder(scope.row.orderId)" v-if="scope.row.status == 'paid'">
            <template #reference>
              <el-button link type="primary" size="small">审核</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="sizes, total, prev, pager, next" :total="totalNum" :currentPage="search.page" :pageSize="search.size">
    </el-pagination>
  </el-card>

</template>

<script>
export default {
  data() {
    return {
      date: [],
      search: {
        page: 1,
        size: 10,
      },
      totalNum: 0,
      tableData: [],
      exportLoading:false,
    };
  },
  created() {
    if (this.$route.query.page) {
      this.search.page = +this.$route.query.page;
    }
    if (this.$route.query.size) {
      this.search.size = +this.$route.query.size;
    }
    if (this.$route.query.oid) {
      this.search.oid = this.$route.query.oid;
    }
    if (this.$route.query.userId) {
      this.search.userId = this.$route.query.userId;
    }
    if (this.$route.query.status) {
      this.search.status = this.$route.query.status.split(",");
    }
    this.getOrderList();
  },
  methods: {
    // 查询订单列表
    async getOrderList() {
      const res = await this.$request.post(
        "/api-mall/admin/api/v1/order/find_order_list",
        this.search
      );
      if (res.data.code === 200) {
        this.tableData = res.data.data.list;
        this.totalNum = res.data.data.total;
        this.$router.push(`/order/list?${this.changeParam(this.search)}`);
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
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.search.size = val;
      this.getOrderList();
    },
    // 对象转get参数
    changeParam(object) {
      let arr = [];
      for (const key in object) {
        if (Array.isArray(object[key])) {
          arr.push(`${key}=${object[key].join()}`);
        } else {
          arr.push(`${key}=${object[key]}`);
        }
      }
      return arr.join("&");
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.search.page = val;
      this.getOrderList();
    },
    // 订单操作发货
    async sendOrder(id) {
      const res = await this.$request.get(
        "/api-mall/admin/api/v1/order/send_order?orderId=" + id
      );
      if (res.data.code === 200) {
        this.$message.success(res.data.message);
        this.getOrderList();
      }
    },
    // 订单退款
    async refundOrder(id) {
      const res = await this.$request.get(
        "/api-mall/admin/api/v1/order/refund_order?orderId=" + id
      );
      if (res.data.code === 200) {
        this.$message.success(res.data.message);
        this.getOrderList();
      }
    },
    // 去订单详情页
    async goOrderInfoPage(id) {
      this.$router.push("/order/info?id=" + id);
    },
    // 点击重制按钮
    resetSearch() {
      let search = {
        page: this.search.page,
        size: this.search.size,
      };
      this.search = search;
      this.date = [];
      this.getOrderList();
    },
    //时间改变
    dataChange(val) {
      if (val == null) {
        delete this.search.startCreateTime;
        delete this.search.endCreateTime;
      } else {
        this.search.startCreateTime = val[0];
        this.search.endCreateTime = val[1];
      }
    },
    // 导出excel
    async exportExcel() {
      this.exportLoading = true;
      let postData = this.$deepClone(this.search);
      delete postData.page;
      delete postData.size;

      const res = await this.$request({
        method: "post",
        url: "/api-mall/admin/api/v1/order/export_orders",
        responseType: "blob",
        data: postData,
      });

      const blob = res.data;
      const fileName = new Date().getTime() + "_订单.xls";
      // const fileName = res.headers["content-disposition"].split("filename=")[1];

      if ("download" in document.createElement("a")) {
        // 非IE下载
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        console.log(elink.href);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      } else {
        // IE10+下载
        navigator.msSaveBlob(blob, fileName);
      }

      this.exportLoading = false;
    },
  },
};
</script>

<style scoped>
.el-pagination {
  margin-top: 10px;
}
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0px;
}
.el-select {
  width: 100%;
}
</style>