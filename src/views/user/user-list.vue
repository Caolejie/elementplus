<template>
  <el-card shadow="never" style="margin-bottom: 10px;">
    <div class="search">
      <el-row :gutter="30">
        <el-col :span="6">
          <el-form-item label="userId:" style="margin-bottom: 0;">
            <el-input v-model="search.userId" placeholder="请输入userId" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户昵称:" style="margin-bottom: 0;">
            <el-input v-model="search.nickname" placeholder="请输入昵称" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="openid:" style="margin-bottom: 0;">
            <el-input v-model="search.openid" placeholder="请输入openid" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="getUserList()">查询</el-button>
          <el-button @click="resetSearch()">重置</el-button>
        </el-col>
      </el-row>
    </div>
  </el-card>
  <el-card shadow="never">
    <!-- 表格区域 -->
    <el-table :data="tableData" stripe>
      <el-table-column label="头像" width="100">
        <template #default="scope">
          <el-avatar :src="scope.row.avatarUrl" />
        </template>
      </el-table-column>
      <el-table-column prop="userId" label="userId" />
      <el-table-column prop="nickName" label="昵称" />
      <el-table-column prop="point" label="积分" />
      <el-table-column prop="openid" label="openid" width="280" />
      <el-table-column prop="createTime" label="注册时间" width="175" />
      <el-table-column label="操作" width="170" fixed="right">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="$router.push(`/user/info?id=${scope.row.userId}`)">查看</el-button>
          <!-- <el-popconfirm title="确定要删除吗?" @confirm="deleteItem(scope.row.eventId)">
            <template #reference>
              <el-button link type="primary" size="small">删除</el-button>
            </template>
          </el-popconfirm> -->
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="sizes, total, prev, pager, next" :total="totalNum" :currentPage="search.pageNum" :pageSize="search.pageSize">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      totalNum: 0,
      search: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    if (this.$route.query.pageNum) {
      this.search.pageNum = +this.$route.query.pageNum;
    }
    if (this.$route.query.pageSize) {
      this.search.pageSize = +this.$route.query.pageSize;
    }
    if (this.$route.query.userId) {
      this.search.userId = +this.$route.query.userId;
    }
    if (this.$route.query.nickname) {
      this.search.nickname = +this.$route.query.nickname;
    }
    if (this.$route.query.openid) {
      this.search.openid = +this.$route.query.openid;
    }
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const res = await this.$request.get(
        "/api-mall/admin/api/v1/user/find_user_by_nickname",
        { params: this.search }
      );
      if (res.data.code === 200) {
        this.tableData = res.data.data.list;
        this.totalNum = res.data.data.total;
        this.$router.push(`/user/list?${this.changeParam(this.search)}`);
      }
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.search.pageSize = val;
      this.getUserList();
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.search.pageNum = val;
      this.getUserList();
    },
    resetSearch() {
      let search = {
        pageNum: this.search.pageNum,
        pageSize: this.search.pageSize,
      };
      this.search = search;
      this.getUserList();
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
</style>