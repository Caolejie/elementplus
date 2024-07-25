<template>
  <el-card shadow="never" style="margin: 10px 0;">
    <el-row :gutter="30">
      <el-col :span="8">
        <el-form-item label="订单号:" style="margin-bottom: 0;">
          <el-input v-model="search.oid" placeholder="请输入订单号" />
        </el-form-item>
      </el-col>
      
      <el-col :span="8">
        <el-form-item label="订单状态:" style="margin-bottom: 0;">
          <el-select v-model="search.status" placeholder="请选择订单状态" style="width:100%;" multiple>
            <el-option label="创建" value="CREATE" />
            <el-option label="超时" value="_OVER_TIME" />
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

      <el-col :span="8">
        <el-button type="primary" @click="getOrderList()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
      </el-col>
    </el-row>
  </el-card>
  <el-card>
    
    <el-button :disabled="totalNum > 10000" :loading="exportLoading" type="primary" @click="exportExcel()" size="small" style="margin-bottom:10px;">导出 {{totalNum}} 条数据</el-button>
    <el-table :data="tableData" stripe>
      <el-table-column label="订单状态">
        <template #default="scope">
          {{this.getStatusText(scope.row.status)}}
        </template>
      </el-table-column>
      <el-table-column label="订单属性">
        <template #default="scope">
          {{this.getSourceText(scope.row.source)}}
        </template>
      </el-table-column>
      <el-table-column prop="active" label="订单信息" />
      <el-table-column label="商品内容" width="200">  
        <template #default="scope">  
          <!-- <img :src="scope.row.avatarUrl" alt="头像" style="width: 100%; height: auto;">  -->
          <ul>
            <li>{{scope.row.orderComboRels[0].comboSnapshot.productComboRelInfoVOList[0].productInfoVO.name}}</li>
            <li>{{scope.row.orderComboRels[0].comboSnapshot.productComboRelInfoVOList[1].productInfoVO.name}}</li>
            <li>{{scope.row.orderComboRels[0].comboSnapshot.productComboRelInfoVOList[2].productInfoVO.name}}</li>
            <li>{{scope.row.orderComboRels[0].comboSnapshot.productComboRelInfoVOList[3].productInfoVO.name}}</li>
            <li>{{scope.row.orderComboRels[0].comboSnapshot.productComboRelInfoVOList[4].productInfoVO.name}}</li>
            <li>{{scope.row.orderComboRels[0].comboSnapshot.productComboRelInfoVOList[5].productInfoVO.name}}</li>
            <!-- <li>{{scope.row.orderComboRels[0].comboSnapshot.productComboRelInfoVOList[6].productInfoVO.name}}</li> -->
          </ul> 
        </template>  
      </el-table-column>  
      

      <el-table-column fixed="right" label="操作" width="130">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="goOrderInfoPage(scope.row.orderId)">详情</el-button>

          <!-- <el-popconfirm title="确定要操作退款吗?" @confirm="refundOrder(scope.row.orderId)" v-if="scope.row.status != 'refunded' && scope.row.status != '_over_time'">
            <template #reference>
              <el-button link type="primary" size="small">退款</el-button>
            </template>
          </el-popconfirm>

          <el-popconfirm title="确定要操作审核吗?" @confirm="sendOrder(scope.row.orderId)" v-if="scope.row.status == 'paid'">
            <template #reference>
              <el-button link type="primary" size="small">审核</el-button>
            </template>
          </el-popconfirm> -->
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="sizes, total, prev, pager, next" :total="totalNum" :currentPage="search.pageNum" :pageNumSize="search.pageSize">
    </el-pagination>
  </el-card>
  <div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: [],
      search: {
        pageNum: 1,
        pageSize: 10,
      },
      totalNum: 0,
      tableData: [],
      exportLoading:false,
    };
  },
  created() {
    if (this.$route.query.pageNum) {
      this.search.pageNum = +this.$route.query.pageNum;
    }
    if (this.$route.query.pageSize) {
      this.search.pageSize = +this.$route.query.pageSize;
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
    if (this.$route.query.source) {
      this.search.source = this.$route.query.source.split(",");
    }
    this.getOrderList();
  },
  methods: {
    // 查询订单列表
    async getOrderList() {
      const res = await this.$request.post(
        "/mall/cms/api/v1/mall_order/query_order_by_page",
        this.search
      );
      if (res.data.code === 200) {
        this.tableData = res.data.data.list;
        this.totalNum = res.data.data.total;
        this.$router.push(`/order/list?${this.changeParam(this.search)}`);
      }
    },
    getStatusText(value) {
      if (value == "unpaid") {
        return "待付款";
      } else if (value == "paid") {
        return "待发货";
      } else if (value == "shipped") {
        return "已发货";
      } else if (value == "completed") {
        return "已完成";
      } else if (value == "refunded") {
        return "已退款";
      } else if (value == "refund_apply") {
        return "申请退款中";
      } else if (value == "cancelled") {
        return "已取消";
      } else {
        return value;
      }
    },
    getSourceText(value) {
      if (value == "user-gift'") {
        return "送礼订单";
      } else {
        return "个人订单";
      }
    },
    // 每页条数改变时触发 选择一页显示多少行
    handlepsizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.search.pageSize = val;
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
      this.search.pageNum = val;
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
        pageNum: this.search.pageNum,
        pageSize: this.search.pageSize,
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
      delete postData.pageNum;
      delete postData.pageSize;

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