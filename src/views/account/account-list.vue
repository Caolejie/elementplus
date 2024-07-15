<template>
  <div style="height:100%;display:flex;flex-direction:column;">
    <!-- 按钮区域 -->
    <div style="margin-bottom:10px;">
      <el-button type="primary" @click="visible = true">新增账号</el-button>
    </div>

    <!-- 查询区域 -->


    <!-- 表格区域 -->
    <el-table :data="tableList" style="flex:1;" v-loading="loading">
      <el-table-column prop="id" label="账号ID" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="department" label="部门" />
      <el-table-column prop="role.roleName" label="角色" />
      <el-table-column prop="account" label="账号" />
      <el-table-column label="状态">
        <template #default="scope">
          <template v-if="scope.row.status">
            <i
              style="display: inline-block; background-color: #67C23A; width: 10px; height: 10px;border-radius: 50%;"></i>
            启用
          </template>
          <template v-else>
            <i
              style="display: inline-block; background-color: #909399; width: 10px; height: 10px;border-radius: 50%;"></i>
            禁用
          </template>
        </template>
      </el-table-column>


      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="editItem(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 新增或编辑的抽屉 -->
  <sDrawer v-model="visible" :title="form.id ? '编辑账号' : '新增账号'" size="35%" :close-on-click-modal="false">
    <el-form :model="form" label-width="80px" ref="ruleFormRef" :rules="rules">
      <el-form-item label="姓名:">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="部门:">
        <el-select v-model="form.department" style="width: 100%;" placeholder="请选择部门">
          <el-option label="总经办(GMO)" value="总经办(GMO)" />
          <el-option label="数字化技术办公室(DTO)" value="数字化技术办公室(DTO)" />
          <el-option label="销售部(Sales)" value="销售部(Sales)" />
          <el-option label="电商营销中心(ECMC)" value="电商营销中心(ECMC)" />
          <el-option label="市场部(Marketing)" value="市场部(Marketing)" />
          <el-option label="患者服务(PS)" value="患者服务(PS)" />
          <el-option label="运营服务中心(S&O)" value="运营服务中心(S&O)" />
          <el-option label="新兴市场部(EM)" value="新兴市场部(EM)" />
          <el-option label="注册部(RA)" value="注册部(RA)" />
          <el-option label="政府事务部(GA)" value="政府事务部(GA)" />
          <el-option label="医学事务部(MA)" value="医学事务部(MA)" />
          <el-option label="研发部(R&D)" value="研发部(R&D)" />
          <el-option label="数字医疗部(DHT)" value="数字医疗部(DHT)" />
          <el-option label="ALA 中国区产品部" value="ALA 中国区产品部" />
          <el-option label="财务部(Finance)" value="财务部(Finance)" />
          <el-option label="法务合规部(L&C)" value="法务合规部(L&C)" />
        </el-select>
      </el-form-item>
      <el-form-item label="角色:" prop="roleId">
        <el-select v-model="form.roleId" style="width: 100%;" placeholder="请选择角色">
          <el-option :label="rItem.roleName" :value="rItem.roleId" v-for="(rItem, rIndex) in roleList" :key="rIndex" />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号:" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="账号:" prop="account">
        <el-input v-model="form.account" />
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <el-input v-model="form.password" />
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-select v-model="form.status" style="width: 100%;" placeholder="请选择状态">
          <el-option label="启用" :value="true" />
          <el-option label="禁用" :value="false" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
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
    visible(value) {
      if (!value) {
        this.$refs.ruleFormRef.resetFields()
        this.form = {}
      }
    }
  },
  data() {
    return {
      form: {},
      tableList: [],
      roleList: [],
      loading: false,
      visible: false,
      rules: {
        phone: [
          { required: true, message: "请填写手机号码", trigger: "blur" },
          { validator: this.checkMobile, trigger: 'blur' },
        ],
        account:  [
            { required: true, message: "请填写账号", trigger: "blur" },
        ],
        password:  [
            { required: true, message: "请填写密码", trigger: "blur" },
            { validator: this.checkPassword, trigger: 'blur' },
        ],
        roleId:[
        { required: true, message: "请选择角色", trigger: "change" },
        ],
        status:[
        { required: true, message: "请选择状态", trigger: "change" },
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getRoleList()
  },
  methods: {
    async getList() {
      this.loading = true
      const res = await this.$request.get('/resmed/admin/modules/admin/user/list')
      if (res.data.code === 200) {
        this.tableList = res.data.data
      }
      this.loading = false
    },
    async getRoleList() {
      const res = await this.$request.get('/resmed/admin/modules/role/list')
      if (res.data.code === 200) {
        this.roleList = res.data.data
      }
    },
    //表单校验
    formValidate() {
      this.$refs.ruleFormRef.validate((valid) => {
        if (valid) {
          //表单校验成功
          this.saveData()
        }
      });
    },
    async saveData() {
      const res = await this.$request.post(this.form.id ? '/resmed/admin/modules/admin/user/update' : '/resmed/admin/modules/admin/user/insert', this.form)
      if (res.data.code === 200) {
        this.$message.success(res.data.message)
        this.getList()
        this.visible = false
      }
    },
    editItem(row) {
      this.form = this.$deepClone(row)
      this.visible = true
    },
    checkMobile(rule, value, callback) {
      let pattern = /0?(13|14|15|17|18|19)[0-9]{9}/
      if (pattern.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号'))
      }
    },
    checkPassword(rul,value,callback){
      let pattern = /^(?=.*[a-z])(?=.*[A-Z]).{8,16}$/
      if (pattern.test(value)) {
        callback()
      } else {
        callback(new Error('必须是8-16位且包含大写和小写字母'))
      }
    }
  }
}
</script>

<style scoped></style>