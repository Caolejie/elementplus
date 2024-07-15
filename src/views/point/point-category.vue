<template>
  <div style="height:100%;display:flex;flex-direction:column;">
    <div>
      <el-button type="primary" @click="dialogVisible = true">添加类目</el-button>
    </div>

    <!-- 查询区域 -->
    <el-card shadow="never" style="margin: 10px 0;">
      <el-form :model="search">
        <el-row :gutter="30">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="类目ID:">
              <el-input v-model="search.id" placeholder="请输入类目ID" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="类目名称:">
              <el-input v-model="search.categoryName" placeholder="请输入类目名称" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="类目描述:">
              <el-input v-model="search.remark" placeholder="请输入类目描述" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align: right;">
        <el-button type="primary" @click="getCategoryList()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
      </div>

    </el-card>

    <!-- 表格区域 -->
    <el-table :data="tableList" v-loading="loading" style="flex:1;">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="categoryName" label="类目名称" />
      <el-table-column prop="remark" label="类目描述" />

      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="editItem(scope.row)">编辑
          </el-button>
          <el-popconfirm title="确定要删除吗？" @confirm="deleteItem(scope.row.id)">
            <template #reference>
              <el-button link type="primary" size="small">删除</el-button>
            </template>
          </el-popconfirm>
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
  <el-dialog v-model="dialogVisible" :title="form.id ? '编辑类目' : '添加类目'" :close-on-click-modal="false" width="30%">
    <el-form :model="form" label-width="90px" ref="ruleFormRef" :rules="rules">
      <el-form-item label="类目名称:" prop="categoryName">
        <el-input v-model="form.categoryName" />
      </el-form-item>
      <el-form-item label="类目描述:" prop="remark">
        <el-input v-model="form.remark" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="formValidate()">确定</el-button>
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
      rules: {
        categoryName: [{ required: true, message: "请填写类目名称", trigger: "blur" }],
        remark: [{ required: true, message: "请填写类目描述", trigger: "blur" }],
      },
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    // 查询类目列表
    async getCategoryList() {
      this.loading = true
      const res = await this.$request.post("/api-member/admin/api/v1/sys/memberMallCategory/list", this.search)
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
      this.getCategoryList()
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.search.page = val
      this.getCategoryList()
    },
    //表单校验
    formValidate() {
      this.$refs.ruleFormRef.validate((valid) => {
        if (valid) {
          //表单校验成功
          this.postData()
        }
      });
    },
    // 发送表单数据
    async postData() {
      const res = await this.$request.post(this.form.id ? "/api-member/admin/api/v1/sys/memberMallCategory/modify" : "/api-member/admin/api/v1/sys/memberMallCategory/add", this.form)
      if (res.data.code === 200) {
        this.dialogVisible = false
        this.$message.success(res.data.message)
        this.getCategoryList()
      }
    },
    // 点击编辑
    editItem(row) {
      this.form = this.$deepClone(row)
      this.dialogVisible = true
    },
    // 点击删除
    async deleteItem(id) {
      const res = await this.$request.post("/api-member/admin/api/v1/sys/memberMallCategory/del", [id])
      if (res.data.code === 200) {
        this.$message.success(res.data.message)
        this.getCategoryList()
      }
    },
    // 搜索重置
    resetSearch() {
      let search = {
        page: this.search.page,
        size: this.search.size,
      };
      this.search = search
      this.getCategoryList()
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