<template>
  <el-page-header content="用户详情" @back="$router.back()" style="margin-bottom:10px;" />
  <el-card shadow="never">
    <el-descriptions title="基本信息" border>
      <el-descriptions-item label="头像">
        <el-avatar :src="info.avatarUrl" />
      </el-descriptions-item>
      <el-descriptions-item label="用户ID">{{info.userId}}</el-descriptions-item>
      <el-descriptions-item label="用户昵称">{{info.nickName}}</el-descriptions-item>
      <el-descriptions-item label="积分">{{info.point}}</el-descriptions-item>
      <el-descriptions-item label="openId">{{info.openid}}</el-descriptions-item>
      <el-descriptions-item label="注册时间">{{info.createTime}}</el-descriptions-item>
    </el-descriptions>
    <el-divider></el-divider>

    <!-- <el-card shadow="never" style="margin-top:10px;" v-if="info.orderCombos"> -->
    <div class="el-descriptions__header el-descriptions__title">问卷列表</div>
    <el-table :data="quizList" stripe border>
      <el-table-column prop="documentId" label="问卷ID" />
      <el-table-column label="问卷类型">
        <template #default="scope">
          {{scope.row.type == 'self' ? '自己喝' : '送礼'}}
        </template>
      </el-table-column>
      <el-table-column label="推荐商品数量">
        <template #default="scope">
          {{scope.row.products.length}}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="填写时间" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="editItem(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="sizes, total, prev, pager, next" :total="totalNum" :currentPage="search.page" :pageSize="search.pageSize">
    </el-pagination>
    <!-- </el-card> -->
  </el-card>
  <sQuiz v-model="drawer" :quiz="quiz">
  </sQuiz>
</template>

<script>
import sQuiz from "@/components/s-quiz/s-quiz.vue";
export default {
  components: {
    sQuiz,
  },
  data() {
    return {
      info: {},
      search: {
        page: 1,
        pageSize: 10,
        userId: null,
      },
      quizList: [],
      totalNum: 0,
      drawer: false,
      quiz: {},
    };
  },
  created() {
    if (this.$route.query.id) {
      this.getUserInfo();
      this.search.userId = this.$route.query.id;
      this.getQuizList();
    }
  },
  methods: {
    // 查询订单详情
    async getUserInfo() {
      const res = await this.$request.get(
        "/api-mall/admin/api/v1/user/find_user_by_id?userId=" + this.$route.query.id
      );
      if (res.data.code === 200) {
        this.info = res.data.data;
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
    async getQuizList() {
      const res = await this.$request.post(
        "/api-mall/admin/api/v1/document/find_content_by_page",
        this.search
      );
      if (res.data.code === 200) {
        this.quizList = res.data.data.list;
        this.totalNum = res.data.data.total;
      }
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.search.pageSize = val;
      this.getQuizList();
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.search.page = val;
      this.getQuizList();
    },
    editItem(row) {
      this.quiz = row;
      this.drawer = true;
    },
  },
};
</script>

<style scoped>
.el-pagination {
  margin-top: 10px;
}
</style>