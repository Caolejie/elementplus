<template>
  <el-card shadow="never" style="margin: 10px 0;">
    <el-row :gutter="30">
      <el-col :span="10">
        <el-form-item label="填写时间:" style="margin-bottom: 0;">
          <el-date-picker size="small" v-model="date" @change="dataChange" value-format="YYYY-MM-DD HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:100%;"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="问卷类型:" style="margin-bottom: 0;">
          <el-select v-model="search.documentTypeEnum" placeholder="请选择问卷类型" style="width:100%;">
            <el-option label="自己喝" value="self" />
            <el-option label="送礼" value="gift" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="用户ID:" style="margin-bottom: 0;">
          <el-input v-model="search.userId" placeholder="请输入用户ID" />
        </el-form-item>
      </el-col>
    </el-row>
    <div style="text-align: right;">
      <el-button type="primary" @click="getList()">查询</el-button>
      <el-button @click="resetSearch()">重置</el-button>
    </div>
  </el-card>
  <el-card>
    <el-button :disabled="totalNum > 1000" :loading="exportLoading" type="primary" @click="exportExcel()" size="small" style="margin-bottom:10px;">导出 {{totalNum}} 条数据</el-button>
    <el-table :data="tableData" stripe>
      <el-table-column prop="documentId" label="问卷ID" />
      <el-table-column label="问卷类型">
        <template #default="scope">
          {{this.getStatusText(scope.row.type)}}
        </template>
      </el-table-column>
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column label="填写姓名">
        <template #default="scope">
          {{scope.row.quota.name}}
        </template>
      </el-table-column>
      <el-table-column label="推荐商品数">
        <template #default="scope">
          {{scope.row.products.length}}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="填写时间" width="180" />

      <el-table-column fixed="right" label="操作" width="90">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="lookItem(scope.row)">查看</el-button>

        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="sizes, total, prev, pager, next" :total="totalNum" :currentPage="search.page" :pageSize="search.pageSize">
    </el-pagination>
  </el-card>
  <sQuiz v-model="quizShow" :quiz="quizData"></sQuiz>
</template>

<script>
import sQuiz from "@/components/s-quiz/s-quiz.vue";
export default {
  components: {
    sQuiz,
  },
  data() {
    return {
      date: [],
      search: {
        page: 1,
        pageSize: 10,
      },
      totalNum: 0,
      tableData: [],
      exportLoading: false,
      quizShow: false,
      quizData: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 查询订单列表
    async getList() {
      const res = await this.$request.post(
        "/api-mall/admin/api/v1/document/find_content_by_page",
        this.search
      );
      if (res.data.code === 200) {
        this.tableData = res.data.data.list;
        this.totalNum = res.data.data.total;
      }
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.search.pageSize = val;
      this.getList();
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.search.page = val;
      this.getList();
    },
    // 点击重制按钮
    resetSearch() {
      let search = {
        page: this.search.page,
        pageSize: this.search.pageSize,
      };
      this.search = search;
      this.date = [];
      this.getList();
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
    getStatusText(value) {
      if (value == "gift") {
        return "送礼";
      } else if (value == "self") {
        return "自己喝";
      } else {
        return value;
      }
    },
    // 导出excel
    async exportExcel() {
      this.exportLoading = true;
      let postData = this.$deepClone(this.search);
      delete postData.page;
      delete postData.pageSize;

      const res = await this.$request({
        method: "post",
        url: "/api-mall/admin/api/v1/document/doc-excel",
        responseType: "blob",
        data: postData,
      });

      const blob = res.data;
      const fileName = new Date().getTime() + "_用户问卷数据.xls";
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
    lookItem(row) {
      this.quizData = row;
      this.quizShow = true;
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