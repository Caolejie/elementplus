<template>
  <div>
    <!-- <el-card shadow="never">
      <div>会员定义</div>
    </el-card>
    <el-card shadow="never" style="margin:10px 0;">
      <div>积分配置列表</div>
    </el-card> -->
    <el-card shadow="never">
      <div style="display:flex;justify-content: space-between;align-items: center;margin-bottom:10px;">
        <div>会员等级配置</div>
        <el-button type="primary" size="small" @click="dialogLv = true">新增会员等级</el-button>
      </div>
      <el-table :data="tableLv">
        <el-table-column prop="levelId" label="ID" />
        <el-table-column prop="null" label="等级">
          <template #default="scope">
            Lv.{{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="等级名称" />
        <el-table-column prop="growthScore" label="成长值" />
        <!-- <el-table-column prop="null" label="会员权益数" /> -->
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="editItem(scope.row)">编辑</el-button>
            <el-popconfirm title="确定要删除吗?" @confirm="deleteItem(scope.row.levelId)">
              <template #reference>
                <el-button link type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
  <!-- 新增或编辑题目的抽屉 -->
  <sDrawer v-model="dialogLv" :title="formLv.questionId ? '编辑题目' : '新增题目'" size="50%" :close-on-click-modal="false">
    <el-form :model="formLv" :rules="rules" label-width="90px" ref="ruleFormRef">
      <el-form-item label="等级ID:" v-if="formLv.questionId">
        {{ formLv.questionId }}
      </el-form-item>
      <el-form-item label="等级名称:">
        <el-input v-model="formLv.name" />
      </el-form-item>
      <!-- <el-form-item label="等级描述:">
        <el-input v-model="formLv.desc" disabled />
      </el-form-item> -->
      <el-form-item label="成长值到达:">
        <el-input v-model="formLv.growthScore" type="number" />
      </el-form-item>
      <el-form-item label="免邮特权:">
        <el-switch v-model="formLv.freeShippingPrivilege" />
      </el-form-item>
      <el-form-item label="优先发货:">
        <el-switch v-model="formLv.priorityShip" />
      </el-form-item>
      <el-form-item label="生日积分:">
        <el-switch v-model="formLv.birthdayGivePoint" />
      </el-form-item>
      <el-form-item label="专属折扣:">
        <el-switch v-model="formLv.exclusiveDiscount" />
      </el-form-item>
      <el-form-item label="多倍积分:">
        <el-switch v-model="formLv.multiplePoints" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogLv = false">取消</el-button>
      <el-button type="primary" @click="formValidate()">确定</el-button>
    </template>
  </sDrawer>
</template>

<script>
import sDrawer from "@/components/s-drawer/s-drawer.vue"
export default {
  components: {
    sDrawer,
  },
  watch: {
    dialogLv(value) {
      if (!value) {
        this.$refs.ruleFormRef.resetFields()
        this.formLv = {}
      }
    }
  },
  data() {
    return {
      tableLv: [],
      formLv: {},
      dialogLv: false,
      rules: {
        name: [{ required: true, message: "请填写题目标题", trigger: "blur" }],
        type: [{ required: true, message: "请选择题目类型", trigger: "change" }],
      }
    }
  },
  created() {
    this.getAllLevel()
  },
  methods: {
    // 获取等级列表
    async getAllLevel() {
      const res = await this.$request.get("/api-member/admin/api/v1/sys/member-level/all-level")
      if (res.data.code === 200) {
        this.tableLv = res.data.data
      }
    },
    // 表单校验
    formValidate() {
      // this.$refs.ruleFormRef.validate((valid) => {
      //   if (valid) { //表单校验成功
      //     this.postData()
      //   }
      // })
      this.postData()
    },
    // 发送数据
    async postData() {
      const res = await this.$request.post(this.formLv.levelId ? "/api-member/admin/api/v1/sys/member-level/modify" : "/api-member/admin/api/v1/sys/member-level/add", this.formLv)
      if (res.data.code === 200) {
        this.$message.success(res.data.message)
        this.dialogLv = false
        this.getAllLevel()
      }
    },
    // 点击编辑一个会员等级
    editItem(row){
      this.formLv = this.$deepClone(row)
      this.dialogLv = true
    },
    // 点击删除一个会员等级
    async deleteItem(id) {
      const res = await this.$request.post("/api-member/admin/api/v1/sys/member-level/del", [id])
      if (res.data.code === 200) {
        this.$message.success(res.data.message)
        this.getAllLevel()
      }
    },
  }
}
</script>