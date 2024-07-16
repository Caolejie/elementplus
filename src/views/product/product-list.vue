<template>
  <el-button type="primary" @click="$router.push(`/product/info`)" style="margin-bottom:10px;">新增商品</el-button>

  <el-card shadow="never" style="margin: 10px 0;">
    <el-row :gutter="30">
      <el-col :span="8">
        <el-form-item label="商品名称:" style="margin-bottom: 0;">
          <el-input v-model="search.title" placeholder="请输入商品名称" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="英文名称:" style="margin-bottom: 0;">
          <el-input v-model="search.titleEn" placeholder="请输入商品英文名" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="上下架:" style="margin-bottom: 0;">
          <el-select v-model="search.saleable" placeholder="请选择上下架状态" multiple style="width:100%;">
            <el-option label="上架" value="saleable" />
            <el-option label="下架" value="unsaleable" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="30">
      <el-col :span="8">
        <el-form-item label="风格:" style="margin-bottom: 0;">
          <el-select v-model="search.style" placeholder="选择风格" multiple>
            <!-- 白葡萄酒风格 -->
            <el-option label="Refreshing" value="Refreshing" />
            <el-option label="Aromatic" value="Aromatic" />
            <el-option label="creamy" value="creamy" />
            <!-- 红葡萄酒风格 -->
            <el-option label="Airy" value="Airy" />
            <el-option label="Gentle" value="Gentle" />
            <el-option label="Bold" value="Bold" />

          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="复杂度:" style="margin-bottom: 0;">
          <el-select v-model="search.complexity" placeholder="选择复杂度" multiple>
            <el-option label="Simple" value="Simple" />
            <el-option label="Intermediate" value="Intermediate" />
            <el-option label="Complex" value="Complex" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="品类:" style="margin-bottom: 0;">
          <el-select v-model="search.categoryId" placeholder="请选择品类" style="width:100%;">
            <el-option label="红葡萄酒" :value="1" />
            <el-option label="白葡萄酒" :value="2" />
            <el-option label="起泡酒" :value="3" />
          </el-select>
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
      <el-table-column prop="productId" label="商品ID" width="90" />
      <el-table-column prop="title" label="商品名" />
      <el-table-column prop="titleEn" label="英文名" />

      <!-- <el-table-column prop="price" label="原价" width="100" /> -->
      <el-table-column prop="salesPrice" label="售价" width="100" />
      <el-table-column prop="stock" label="逻辑库存" width="100" />
      <el-table-column prop="realStock" label="真实库存" width="100" />
      <el-table-column label="今日销量" width="100">
        <template #default="scope">
          {{scope.row.numMap.todayNums}}
        </template>
      </el-table-column>
      <el-table-column label="累计销量" width="100">
        <template #default="scope">
          {{scope.row.numMap.historyNums}}
        </template>
      </el-table-column>
      <el-table-column label="品类">
        <template #default="scope">
          {{getCategoryText(scope.row.categoryId)}}
        </template>
      </el-table-column>

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
          <el-button :loading="downloadId == scope.row.productId" link type="primary" size="small" @click="downloadQr(scope.row.productId)">小程序码</el-button>

          <el-popconfirm title="确定要上架该商品吗?" @confirm="clickSaleable(scope.row.productId,'saleable')" v-if="scope.row.saleable == 'unsaleable'">
            <template #reference>
              <el-button link type="primary" size="small">上架</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm title="确定要下架该商品吗?" @confirm="clickSaleable(scope.row.productId,'unsaleable')" v-else>
            <template #reference>
              <el-button link type="primary" size="small">下架</el-button>
            </template>
          </el-popconfirm>

          <el-button link type="primary" size="small" @click="editProductItem(scope.row.productId)">编辑</el-button>

          <el-popconfirm title="确定要删除该商品吗?" @confirm="deleteProduct(scope.row.productId)">
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
    if (this.$route.query.title) {
      this.search.title = this.$route.query.title;
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
    if (this.$route.query.titleEn) {
      this.search.titleEn = this.$route.query.titleEn;
    }
    this.getProductList();
  },
  methods: {
    // 获取商品列表
    async getProductList() {
      const res = await this.$request.post(
        "/api-mall/admin/api/v1/products/list",
        this.search
      );
      if (res.data.code === 200) {
        this.tableData = res.data.data.list;
        this.totalNum = res.data.data.total;
        this.$router.push(
          `/product/list?${this.changeParam(this.search)}`
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
        "/api-mall/admin/api/v1/products/saleable/" + id + "?status=" + type
      );
      if (res.data.code === 200) {
        this.$message.success(res.data.message);
        this.getProductList();
      }
    },
    // 删除商品
    async deleteProduct(id) {
      const res = await this.$request.get(
        "/api-mall/admin/api/v1/products/delete?id=" + id
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
    // 下载小程序二维码
    async downloadQr(id) {
      this.downloadId = id
      const res = await this.$request.post("/api-mall/admin/api/v1/products/qr-code", {
        page: "pages/product/product",
        scene: id,
      });
      if (res.data.code === 200) {
        let base64Str = "data:image/jpeg;base64," + res.data.data;
        let aLink = document.createElement("a");
        aLink.style.display = "none";
        aLink.href = base64Str;
        aLink.download = `${id}.jpg`;
        // 触发点击-然后移除
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink);
      }
      this.downloadId = null
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
</style>