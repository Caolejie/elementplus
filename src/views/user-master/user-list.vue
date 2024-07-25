<template>
  <div style="height:100%;display:flex;flex-direction:column;">

    <!-- 查询区域 -->
    <el-card shadow="never" style="margin: 10px 0;">
      <el-form :model="search">
        <el-row :gutter="30">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="用户昵称:">
              <el-input v-model="search.nickName" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="手机号:">
              <el-input v-model="search.phone" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="问卷状态:">
              <el-select v-model="search.type" placeholder="请选择" style="width:100%;" clearable >
                <el-option label="完成个人问卷" value="完成个人问卷" />
                <el-option label="未完成个人问卷" value="未完成个人问卷" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="亲友问卷状态:">
              <el-select v-model="search.reation" placeholder="请选择" style="width:100%;" clearable >
                <el-option label="完成亲友问卷" value="完成亲友问卷" />
                <el-option label="未完成亲友问卷" value="未完成亲友问卷" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="个人订单状态:">
              <el-select v-model="search.isCombos" placeholder="请选择" style="width:100%;" clearable >
                <el-option label="已下个人单" value="1" />
                <el-option label="未下个人单" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="送礼状态:">
              <el-select v-model="search.userBizInfo" placeholder="请选择" style="width:100%;" clearable >
                <el-option label="已送礼" value="1" />
                <el-option label="未送礼" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align: right;">
        <el-button type="primary" @click="getuserList()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
      </div>

    </el-card>

    <!-- 表格区域 -->
    <el-table :data="userData" style="flex:1;" v-loading="loading">
      <el-table-column prop="nickName" label="用户昵称" />
      <el-table-column label="头像" width="100">  
        <!-- <template #default="scope">  
          <img :src="scope.row.avatarUrl" alt="头像" style="width: 100%; height: auto;">  
        </template>   -->
      </el-table-column>  
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="umionld" label="问卷状态" />
      <el-table-column prop="openId" label="个人订单状态"  />
      <el-table-column prop="" label="亲友订单状态"  />
      <el-table-column prop="userBizInfo" label="送礼状态"  />
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-button link type="primary" size="small"
            @click="edituserItem(scope.row.id)">详情</el-button>
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
  data() {
    return {
      userData: [],
      loading: false,
      totalNum: 0,
      search: {
        pageNum: 1,
        pageSize: 10,
      },
      id: null, 
    }
  },
  created() {
    console.log(this.$route.query);
    if (this.$route.query.pageNum) {
      this.search.pageNum = +this.$route.query.pageNum;
    }
    if (this.$route.query.pageSize) {
      this.search.pageSize = +this.$route.query.pageSize;
    }
    if (this.$route.query.nickName) {
      this.search.nickName = this.$route.query.nickName;
    }
    if (this.$route.query.phone) {
      this.search.phone = this.$route.query.phone;
    }
    if (this.$route.query.userBizInfo) {
      this.search.userBizInfo = this.$route.query.userBizInfo;
    }
    if (this.$route.query.isCombos) {
      this.search.isCombos = this.$route.query.isCombos;
    }
    if (this.$route.query.type) {
      this.search.type = this.$route.query.type;
    }
    this.getuserList()
  },
  methods: {
     // 查询用户列表
    async getuserList() {
      const res = await this.$request.post(
        "/mall/cms/api/v1/user/get_user_by_page",
        this.search
      );
      if (res.data.code === 200) {
        this.userData = res.data.data.list;
        this.totalNum = res.data.data.total; // 更新总记录数
      }
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.search.pageSize = val
      this.getuserList()
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.search.pageNum = val
      this.getuserList()
    },
    // 搜索重置
    resetSearch() {
      let search = {
        page: this.search.pageNum,
        size: this.search.pageSize,
      };
      this.search = search
      this.getuserList()
    },
    // 点击查看
    edituserItem(id) {
      this.$router.push(`/user-master/info?id=${id}`);
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