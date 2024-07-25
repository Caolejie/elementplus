<template>
  <div>
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/login' }">
      <el-icon>
        <House />
      </el-icon>
    </el-breadcrumb-item>
    <el-breadcrumb-item>
      <a href="/user-master/list">用户管理</a>
      
    </el-breadcrumb-item>
    <el-breadcrumb-item>用户详情</el-breadcrumb-item>
    </el-breadcrumb>

<!-- 基本信息 -->
<el-card shadow="never" :model="form" style="margin: 10px 0;">
    <el-descriptions title="基本信息" stripe>
      <el-descriptions-item label="用户昵称:">{{form.nickName}}</el-descriptions-item>
      <el-descriptions-item label="手机号:">{{form.phone}}</el-descriptions-item>
      <el-descriptions-item label="openid:">222</el-descriptions-item>
      <el-descriptions-item label="用户头像:"></el-descriptions-item>
    </el-descriptions>
</el-card>
<el-card shadow="never" style="margin: 10px 0;">
    <el-descriptions title="用户状态" stripe>
      <el-descriptions-item label="问卷状态:">444</el-descriptions-item>
      <el-descriptions-item label="亲友问卷状态:">18100000000</el-descriptions-item>
      <el-descriptions-item label="个人下单状态:">222</el-descriptions-item>
      <el-descriptions-item label="送礼状态:">都</el-descriptions-item>
    </el-descriptions>
</el-card>

<el-card shadow="never" style="margin: 10px 0; position :relative;">
    <h3>问卷信息</h3>
    <div class="wenjuan" >
            <el-table :data="fomeInfo" :header-cell-style="{backgroundColor:'rgb(225, 225, 228)',color:'black'}">
            <el-table-column prop="id" label="编号" width="100" />
            <el-table-column prop=""  label="报告归属" width="100" />
            <el-table-column prop="" label="完成时间" width="100" />
            <el-table-column fixed="right" label="操作" width="100">
                <template #default="scope">
                  <el-button link type="primary" size="small" @click="editProductItem(scope.row.id)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
    </div>
</el-card>

<el-card shadow="never" style="margin: 10px 0; position :relative;">
    <h3>订单信息</h3>
    <div class="dingdan">
            <el-table :data="fomeInfo" :header-cell-style="{backgroundColor:'rgb(225, 225, 228)',color:'black'}">
              <el-table-column prop="id" label="编号" width="100" />
              <el-table-column prop=""  label="订单号" width="100" />
              <el-table-column prop="" label="下单时间" width="100" />
              <el-table-column fixed="left" label="操作" width="100">
                <template #default="scope"> 
                  <el-button link type="primary" size="small" @click="editProductItem(scope.row.id)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
    </div>
</el-card>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      form:{},
      tableData: [],
      totalNum: 0,
      search: {
        pageNum: 1,
        pageSize: 10,
      },
      downloadId: null,

      currentPage1: 1,
      fomeInfo:[],
      active: 1,
      id: null, //商品ID
      

    };
  },
  created() {
    
    console.log(this.$route.query);
    if (this.$route.query.pageNum) {
      this.search.pageNum = +this.$route.query.pageNum;
    }
    if (this.$route.query.pageSize) {
      this.search.pageSize = +this.$route.query.pageSize;
    }
    if (this.$route.query.name) {
      this.search.name = this.$route.query.name;
    }
    if (this.$route.query.id) {
      this.search.id = this.$route.query.id;
    }
    this.getuserInfo();
    
    console.log(this.$route.query);
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
    }
    this.getuserInfo();
  },
  methods: {
    

    // 获取用户列表
    async getuserInfo() {
      const res = await this.$request.get(
        "/mall/cms/api/v1/user/get_user_complete_info?id=" + this.id
      );
      if (res.data.code === 200) {
        this.form = res.data.data;
      }
    },

  
    // 跳转详情页
    fomeinfo(id) {
      this.$router.push(`/product/info?id=${id}`);
      // this.$router.push(`/ceshi/fomeinfo?id=${id}`);
    },
    
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.search.pageSize = val;
      this.getuserInfo();
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.search.pageNum = val;
      this.getuserInfo();
    },

    // 删除商品
    async deleteProduct(id) {
      const res = await this.$request.get(
        "/mall/cms/api/v1/product/get_product_info/delete?id=" + id
      );
      if (res.data.code === 200) {
        this.$message.success(res.data.message);
        this.getuserInfo();
      }
    },
    // 搜索重置
    resetSearch() {
      let search = {
        page: this.search.page,
        size: this.search.size,
      };
      this.search = search;
      this.getuserInfo();
    },

    // 点击编辑
    editProductItem(id) {
      this.$router.push(`/product/info?id=${id}`);
      // this.$router.push(`/ceshi/change?id=${id}`);
    },
    
  },
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0px;
}


.el-table-column {
  
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
}

.wenjuan {
  position: relative;
  left: 350px;
  top: 0px;
}
.dingdan {
  position: relative;
  left: 350px;
  top: 0px;
}

.el-table {
  width: 500px;
}

</style>