<template>
  <div style="height:100%;display:flex;flex-direction:column;">

    <!-- 查询区域 -->
    <el-card shadow="never" style="margin: 10px 0;">
      <el-form :model="search">
        <el-row :gutter="30">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="姓名:">
              <el-input v-model="search.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8">
            <el-form-item label="登陆时间:">
              <el-date-picker v-model="date" @change="dataChange" value-format="YYYY-MM-DD HH:mm:ss" type="datetimerange"
                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align: right;">
        <el-button type="primary" @click="getList()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
      </div>
    </el-card>

    <!-- 表格区域 -->
    <el-table :data="tableList" style="flex:1;" v-loading="loading">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="methodName" label="操作" />
      <el-table-column prop="ip" label="操作IP" />
      <el-table-column prop="createTime" label="登陆时间" />
    </el-table>

    <!-- 分页 -->
    <div style="background-color: #fff;display: flex;justify-content: flex-end;padding: 5px 0;">
      <el-pagination background @sizeChange="getList" @currentChange="getList" layout="total, sizes, prev, pager, next"
        :total="totalNum" v-model:currentPage="search.pageNum" v-model:pageSize="search.pageSize">
      </el-pagination>
    </div>

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
      tableList: [],
      loading: false,
      visible: false,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const res = await this.$request.post('/resmed/admin/modules/loginLogs/list', this.search)
      if (res.data.code === 200) {
        this.tableList = res.data.data.list
        this.totalNum = res.data.data.total
      }
      this.loading = false
    },
    // 搜索重置
    resetSearch() {
      let search = {
        pageNum: this.search.pageNum,
        pageSize: this.search.pageSize,
      };
      this.search = search
      this.date = []
      this.getList()
    },
    //时间改变
    dataChange(val) {
      if (val == null) {
        delete this.search.startTime;
        delete this.search.endTime;
      } else {
        this.search.startTime = val[0];
        this.search.endTime = val[1];
      }
    },
    getPhone(str) {
      return str.substring(0, 3) + "*".repeat(str.length - 7) + str.substring(str.length - 4)
    },
  }
}
</script>

<style scoped>
.f-c-c{
  display:flex;
  justify-content: center;
  align-items: center;
}
</style>