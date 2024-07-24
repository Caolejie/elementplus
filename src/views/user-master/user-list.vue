<template>
  <div>
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/user-master' }">
      <el-icon>
        <House />
      </el-icon>
    </el-breadcrumb-item>
    <el-breadcrumb-item>
      用户管理
    </el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">用户列表</a></el-breadcrumb-item>
    </el-breadcrumb>

<!-- 查询表格 -->
<el-card shadow="never" style="margin: 10px 0;">
    
    <div class="shang">
      <h2>查询表格</h2>
      <div class="input-search">
      <el-row :gutter="220">
      <el-col :span="8">
        <el-form-item label="用户昵称:" style="margin-bottom: 0;">
          <el-input v-model="search.nickName" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="手机号:" style="margin-bottom: 0;">
          <el-input v-model="search.phone" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="问卷状态:" style="margin-bottom: 0;">
          <el-select v-model="search.complexity" placeholder="请选择" multiple>
            <el-option label="1" value="1" />
            <el-option label="2" value="2" />
          </el-select>
        </el-form-item>
      </el-col>
      </el-row>
      <el-row :gutter="30">
       <el-col :span="8">
        <el-form-item label="个人订单状态:" style="margin-bottom: 0;">
          <el-select v-model="search.complexity" placeholder="请选择" multiple>
            <el-option label="1" value="1" />
            <el-option label="2" value="2" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="送礼状态:" style="margin-bottom: 0;">
          <el-select v-model="search.complexity" placeholder="请选择" multiple>
            <el-option label="1" value="1" />
            <el-option label="2" value="2" />
          </el-select>
        </el-form-item>
      </el-col>
      </el-row>
      </div>
      <div class="key-search">
        <el-button class="searchkey" type="primary" @click="aa()"><el-icon size="15" color="#fff"><Search /></el-icon> 查询</el-button><br>
        <el-button class="backey" @click="resetSearch()"><el-icon size="15" color="rgb(225, 225, 228);"><Edit /></el-icon>重置</el-button>
      </div>
    </div>

    <div class="xia">
      <div class="key-new">
        <el-button class="newkey" type="primary"><el-icon size="15" color="#fff"><Plus /></el-icon>新建</el-button>
        <el-button class="downloadkey"><el-icon><Download /></el-icon>下载</el-button>
      </div>
      <div class="list">
        <el-table :data="tableData" :header-cell-style="{backgroundColor:'rgb(242, 243, 245)',color:'rgb(122, 124, 128)'}" >
        <el-table-column prop="nickName" label="用户昵称" width="170" />
        <el-table-column prop="name"  label="头像" width="100" />
        <el-table-column prop="phone" label="手机号" width="170" />
        <el-table-column prop="normalPrice" label="问卷状态" width="150" />
        <el-table-column prop="logicStock" label="个人订单状态" width="150" />
        <el-table-column prop="realStock" label="送礼状态" width="200" />
        
        <el-table-column fixed="right" label="操作" width="280">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="editProductItem(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
          </el-table>
      </div>
      <!-- 分页 -->
       <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="search.page"
          :page-size="search.size"
          layout="total, prev, pager, next"
          :total="totalNum">
        </el-pagination>
      </div>
    </div>

  </el-card>
  </div>
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
    if (this.$route.query.nickName) {
      this.search.nickName = this.$route.query.nickName;
    }
    if (this.$route.query.phone) {
      this.search.phone = this.$route.query.phone;
    }
    this.aa();
    
    // console.log(this.$route.query);
    // if (this.$route.query.id) {
    //   this.id = this.$route.query.id;
    // }
    // this.getProductInfo();
  },
  methods: {
    // 查询用户列表
    async getProductInfo() {
      const res = await this.$request.get(
        "/mall/user/api/v1/user_info/get_auth?"
      );
      if (res.data.code === 200) {
        this.tableData = res.data.data.list;
        this.totalNum = res.data.data.total;
      }
    },
     // 查询用户详情
    async bb() {
      const res = await this.$request.get(
        "/mall/user/api/v1/user_info/get_user_info?id=" + this.id
      );
      if (res.data.code === 200) {
        this.fomeInfo = res.data.data;
      }
    },
    // 获取用户列表
    async aa() {
      const res = await this.$request.post(
        "/mall/cms/api/v1/user/get_user_by_page",
        this.search
      );
      if (res.data.code === 200) {
        this.tableData = res.data.data.list;
        this.totalNum = res.data.data.total; // 更新总记录数
      }
    },
    
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.search.pageSize = val;
      this.aa();
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.search.pageNum = val;
      this.aa();
    },

    // 搜索重置
    resetSearch() {
      let search = {
        page: this.search.page,
        size: this.search.size,
      };
      this.search = search;
      this.aa();
    },

    // 点击查看
    editProductItem(id) {
      this.$router.push(`/user-master/info?id=${id}`);
    },
    
  },
}
</script>

<style scoped>
.el-icon {
  margin-right: 10px;
}
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

.el-table-column {
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
}

/* 上 */
.shang {
  /* position:absolute; */
  margin-bottom: 50px;
  overflow: hidden;
}
.input-search {
  float: left;
}
.key-search {
  float: right;
  padding-left: 30px;
  border-left: solid 2px rgb(242, 243, 245);

}
.searchkey {
  background-color: rgb(45, 92, 246);
  border: 0;
  margin-bottom: 10px;
}
.backey {
  
  background-color: rgb(242, 243, 245);
}

/* 下 */
.key-new {
  overflow: hidden;
  padding-bottom: 30px;
}
.newkey {
  background-color: rgb(45, 92, 246);
  border: 0;
  float: left;
}
.downloadkey {
  background-color: rgb(242, 243, 245);
  float: right;
}
.block {
  margin-top: 200px;
  float: right;
}
</style>