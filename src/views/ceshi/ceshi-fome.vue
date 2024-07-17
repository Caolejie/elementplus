<template>
<div>
  <el-button type="primary" @click="$router.push(`/product/info`)" style="margin-bottom:10px;">新增商品</el-button>

  <el-card shadow="never" style="margin: 10px 0;">
    <el-row :gutter="30">
      <el-col :span="8">
        <el-form-item label="name:" style="margin-bottom: 0;">
          <el-input v-model="search.name" placeholder="请输入商品名称" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="id:" style="margin-bottom: 0;">
          <el-input v-model="search.id" placeholder="请输入商品id号码" />
        </el-form-item>
      </el-col>
    </el-row>

    <div style="text-align: right;">
      <el-button type="primary" @click="aa()">查询</el-button>
      <el-button @click="resetSearch()">重置</el-button>
    </div>

  </el-card>

  <el-card shadow="never">
    <!-- 表格区域 -->
    
    <el-table :data="tableData" stripe>
      <el-table-column prop="id" label="商品ID" width="90" />
      <el-table-column prop="name"  label="商品名" />
      <el-table-column prop="originPrice" label="原价" width="100" />
      <el-table-column prop="normalPrice" label="售价" width="100" />
      <el-table-column prop="logicStock" label="逻辑库存" width="100" />
      <el-table-column prop="realStock" label="真实库存" width="100" />
      <el-table-column prop="tags" label="描述" width="100"/>
      

      <el-table-column fixed="right" label="操作" width="280">
        <template #default="scope">

          <el-button link type="primary" size="small" @click="editProductItem(scope.row.id)">编辑</el-button>
          <!-- <el-button link type="primary" size="small" @click="fomeinfo(scope.row.id)">查看详情</el-button> -->

          <el-popconfirm name="确定要删除该商品吗?" @confirm="deleteProduct(scope.row.id)">
            <template #reference>
              <el-button link type="primary" size="small">删除</el-button>
            </template>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="sizes, total, prev, pager, next" :total="totalNum" :currentPage="search.page" :pageSize="search.size">
    </el-pagination>
    

  </el-card>
</div>
  

</template>

<script>
// import func from '../../../vue-temp/vue-editor-bridge';
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
    this.aa();

  },
  methods: {
    // 获取商品列表
    async aa() {
      const res = await this.$request.post(
        "/mall/cms/api/v1/product/get_product_by_page",
        this.search
      );
      if (res.data.code === 200) {
        this.tableData = res.data.data.list;
        this.totalNum = res.data.data.total; // 更新总记录数

      }
    },
    // 跳转详情页
    fomeinfo(id) {
      this.$router.push(`/ceshi/fomeinfo?id=${id}`);
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

    // 删除商品
    async deleteProduct(id) {
      const res = await this.$request.get(
        "/mall/cms/api/v1/product/get_product_info/delete?id=" + id
      );
      if (res.data.code === 200) {
        this.$message.success(res.data.message);
        this.aa();
      }
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
    // 品类文本
    getCategoryText(value) {
      if (value == 1) {
        return "红葡萄酒";
      } else if (value == 2) {
        return "白葡萄酒";
      } else if (value == 3) {
        return "起泡酒";
      } else {
        return value;
      }
    },
    // 点击编辑
    editProductItem(id) {
      this.$router.push(`/ceshi/change?id=${id}`);
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

.el-table-column {
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
}
</style>