<template>
  <div style="height:100%;display:flex;flex-direction:column;">

    <!-- 查询区域 -->
    <!-- <el-card shadow="never" style="margin: 10px 0;">
      <el-form :model="search">
        <el-row :gutter="30">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="任务:">
              <el-input v-model="search.couponTemplateId" placeholder="请输入任务" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="任务名称:">
              <el-input v-model="search.keyword" placeholder="请输入任务名称" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="任务类型:">
              <el-select v-model="search.isCombos" placeholder="请选择任务类型" style="width:100%;" clearable>
                <el-option label="商品券" value="combo_coupon" />
                <el-option label="店铺券" value="shop_coupon" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align: right;">
        <el-button type="primary" @click="getTaskList()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
      </div>

    </el-card> -->

    <!-- 表格区域 -->
    <el-table :data="tableList" style="flex:1;" v-loading="loading">
      <el-table-column prop="taskId" label="ID" width="60" />
      <el-table-column prop="taskName" label="任务" />
      <el-table-column prop="taskCode" label="任务类型" />
      <!-- <el-table-column prop="stock" label="任务名称" /> -->
      <!-- <el-table-column prop="null" label="任务描述" /> -->

      <!-- <el-table-column fixed="right" label="操作" width="190">
        <template #default="scope">
          <el-button link type="primary" size="small"
            @click="$router.push(`/point/product-info?id=${scope.row.productId}`)">编辑</el-button>
          <el-popconfirm title="禁领成功后不能再启用！" @confirm="deleteItem(scope.row.productId)">
            <template #reference>
              <el-button link type="primary" size="small">禁领</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column> -->
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
import sDrawer from "@/components/s-drawer/s-drawer.vue"
export default {
  components: {
    sDrawer,
  },
  watch: {

  },
  data() {
    return {
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
    this.getTaskList()
  },
  computed: {
    // type获取题目类型文本
    getText() {
      return (text) => {
        if (text == "full_reduction") {
          return "满减"
        } else if (text == "discount") {
          return "折扣"
        } else if (text == "any") {
          return "所有用户"
        } else if (text == "new") {
          return "新用户"
        } else if (text == "old") {
          return "老用户"
        } else if (text == "auto") {
          return "自动发放"
        } else if (text == "manual") {
          return "手动领取"
        } else if (text == "shop_coupon") {
          return "店铺券"
        } else if (text == "combo_coupon") {
          return "商品券"
        } else if (text == "receiving") {
          return "领取中"
        } else if (text == "closed") {
          return "已结束"
        } else if (text == "disabled") {
          return "已禁用"
        } else if (text == "wait_start") {
          return "未开始"
        } else {
          return text
        }
      }
    },
  },
  methods: {
    // 查询优惠券列表
    async getTaskList() {
      this.loading = true
      const res = await this.$request.post("/api-member/admin/api/v1/sys/member-task/list", this.search)
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
      this.getTaskList()
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.search.page = val
      this.getTaskList()
    },
    // 点击删除
    async deleteItem(id) {
      const res = await this.$request.get("/api-mall/admin/api/v1/couponTemplate/remove?couponTemplateId=" + id)
      if (res.data.code === 200) {
        this.$message.success(res.data.message)
        this.getTaskList()
      }
    },
    // 搜索重置
    resetSearch() {
      let search = {
        page: this.search.page,
        size: this.search.size,
      };
      this.search = search
      this.getTaskList()
    },
    // 下载小程序二维码
    async downloadQr(id) {
      const res = await this.$request.post("/api-mall/admin/api/v1/couponTemplate/qr-code", {
        page: "pages/couponsLink/couponsLink",
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
    },
    async getCouponUrl(id) {
      const res = await this.$request.get("/api-mall/admin/api/v1/couponTemplate/getCouponUrl?targetUrl=pages/couponsLink/couponsLink?scene=" + id)
      if (res.data.code === 200) {
        navigator.clipboard.writeText(res.data.data).then(() => {
          this.$message.success('复制成功，链接30天内有效！')
        })
      }
    }
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