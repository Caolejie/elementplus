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
      <el-button type="primary" @click="getProductList()">查询</el-button>
      <el-button @click="resetSearch()">重置</el-button>
    </div>

  </el-card>

  <el-card shadow="never">
    <!-- 表格区域 -->
    <el-table :data="tableData" stripe>
      <el-table-column prop="id" label="商品ID" width="90" />
      <el-table-column prop="name" label="商品名" />
      <el-table-column prop="originPrice" label="原价" width="100" />
      <el-table-column prop="normalPrice" label="售价" width="100" />
      <el-table-column prop="logicStock" label="逻辑库存" width="100" />
      <el-table-column prop="realStock" label="真实库存" width="100" />
      <el-table-column prop="tags" label="描述" width="220"/>
      
      <el-table-column label="上架状态">
        <template #default="scope">
          <template v-if="scope.row.saleable == 'saleable'">
            <i style="display: inline-block; background-color: #67C23A; width: 10px; height: 10px;border-radius: 50%;"></i>
            已上架
          </template>
          <template v-else>
            <i style="display: inline-block; background-color: #909399; width: 10px; height: 10px;border-radius: 50%;"></i>
            已下架
          </template>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="280">
        <template #default="scope">

          <el-button link type="primary" size="small" @click="editProductItem(scope.row.id)">编辑</el-button>

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
export default {
  data() {
    return {
      tableData: [],
      totalNum: 0,
      search: {
        page: 1,
        size: 10,
      },
      downloadId: null,
    };
  },
  created() {
    console.log(this.$route.query);
    if (this.$route.query.page) {
      this.search.page = +this.$route.query.page;
    }
    if (this.$route.query.size) {
      this.search.size = +this.$route.query.size;
    }
    if (this.$route.query.categoryId) {
      this.search.categoryId = +this.$route.query.categoryId;
    }
    if (this.$route.query.name) {
      this.search.name = this.$route.query.name;
    }
    if (this.$route.query.style) {
      this.search.style = this.$route.query.style.split(",");
    }
    if (this.$route.query.complexity) {
      this.search.complexity = this.$route.query.complexity.split(",");
    }
    if (this.$route.query.saleable) {
      this.search.saleable = this.$route.query.saleable.split(",");
    }
    if (this.$route.query.id) {
      this.search.id = this.$route.query.id;
    }
    this.getProductList();

  },
  methods: {
    // 获取商品列表
    async getProductList() {
      const res = await this.$request.post(
        "/mall/cms/api/v1/product/get_product_by_page",
        this.search
      );
      if (res.data.code === 200) {
        this.tableData = res.data.data.list;
        this.totalNum = res.data.data.total;
        this.$router.push(
          `/ceshi/fome?${this.changeParam(this.search)}`
        );
      }
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.search.size = val;
      this.getProductList();
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.search.page = val;
      this.getProductList();
    },

    // 上下架商品
    async clickSaleable(id, type) {
      const res = await this.$request.get(
        "/mall/cms/api/v1/product/get_product_info/saleable/" + id + "?status=" + type
      );
      if (res.data.code === 200) {
        this.$message.success(res.data.message);
        this.getProductList();
      }
    },
    // 删除商品
    async deleteProduct(id) {
      const res = await this.$request.get(
        "/mall/cms/api/v1/product/get_product_info/delete?id=" + id
      );
      if (res.data.code === 200) {
        this.$message.success(res.data.message);
        this.getProductList();
      }
    },
    // 搜索重置
    resetSearch() {
      let search = {
        page: this.search.page,
        size: this.search.size,
      };
      this.search = search;
      this.getProductList();
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
      this.$router.push(`/product/info?id=${id}`);
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
.el-select {
  width: 100%;
}

.el-table-column {
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
}
</style>