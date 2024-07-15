<template>
  <div style="height:100%;display:flex;flex-direction:column;">

    <!-- 查询区域 -->
    <el-card shadow="never" style="margin: 10px 0;">
      <el-form :model="search">
        <el-row :gutter="30">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="会员ID:">
              <el-input v-model="search.memberId" placeholder="请输入会员ID" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="用户ID:">
              <el-input v-model="search.userId" placeholder="请输入用户ID" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="用户昵称:">
              <el-input v-model="search.nickName" placeholder="请输入用户昵称" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align: right;">
        <el-button type="primary" @click="getMemberList()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
      </div>

    </el-card>

    <!-- 表格区域 -->
    <el-table :data="tableList" style="flex:1;" v-loading="loading">
      <el-table-column prop="memberId" label="会员ID" width="70" />
      <el-table-column prop="userId" label="用户ID" width="70" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="mobile" label="手机号" width="120" />
      <el-table-column prop="birthday" label="生日" />

      <el-table-column label="性别" width="70">
        <template #default="scope">
          {{getGender(scope.row.gender)}}
        </template>
      </el-table-column>
      <el-table-column prop="integration" label="积分" width="70" />
      <el-table-column prop="growth" label="成长值" width="70" />
      <el-table-column prop="createTime" label="注册时间" width="175" />


      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="editItem(scope.row)">调整积分</el-button>
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

  <!-- 表单弹窗 -->
  <el-dialog v-model="dialogVisible" title="调整积分" :close-on-click-modal="false" width="30%">
    <el-form :model="form" label-width="90px" ref="ruleFormRef">
      <el-form-item label="用户ID:">
        {{ form.userId }}
      </el-form-item>
      <el-form-item label="会员昵称:">
        {{ form.nickname }}
      </el-form-item>
      <el-form-item label="现有积分:">
        {{ form.integration }}
      </el-form-item>
      <el-form-item label="操作方式:">
        <el-select v-model="form.taskCode" placeholder="请选择操作方式" style="width:100%;">
          <el-option label="加分" value="customer" />
          <el-option label="减分" value="customer_reduce" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作积分:">
        <el-input v-model="form.point" type="number" />
        (正数增加，负数减少)
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="postData()">确定</el-button>
      </span>
    </template>
  </el-dialog>


</template>

<script>
export default {
  watch: {
    dialogVisible(value) {
      if (!value) {
        this.form = {}
      }
    },
  },
  data() {
    return {
      dialogVisible: false,
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
    this.getMemberList()
  },
  methods: {
    // 查询优惠券列表
    async getMemberList() {
      this.loading = true
      const res = await this.$request.post("/api-member/admin/api/v1/sys/member/list", this.search)
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
      this.getMemberList()
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.search.page = val
      this.getMemberList()
    },
    // 点击删除
    async deleteItem(id) {
      const res = await this.$request.post("/api-member/admin/api/v1/sys/product/del", [id])
      if (res.data.code === 200) {
        this.$message.success(res.data.message)
        this.getMemberList()
      }
    },
    // 点击编辑
    editItem(row) {
      this.form = {
        userId: row.userId,
        nickname: row.nickname,
        integration: row.integration
      }
      this.dialogVisible = true
    },
    // 发送表单数据
    async postData() {
      const res = await this.$request.get("/api-member/admin/api/v1/sys/member/add_sub_point", {
        params: {
          userId: this.form.userId,
          point: this.form.point ? this.form.point : 0,
          taskCode: this.form.taskCode
        }
      })
      if (res.data.code === 200) {
        this.dialogVisible = false
        this.$message.success(res.data.message)
        this.getMemberList()
      }
    },
    // 搜索重置
    resetSearch() {
      let search = {
        page: this.search.page,
        size: this.search.size,
      };
      this.search = search
      this.getMemberList()
    },
    getGender(text){
      if(text == '1'){
        return '男性'
      }else if(text == '2'){
        return '女性'
      }else{
        return '未知'
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