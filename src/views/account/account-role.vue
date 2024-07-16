<template>
  <div style="height:100%;display:flex;flex-direction:column;">
    <!-- 按钮区域 -->
    <div style="margin-bottom:10px;">
      <el-button type="primary" @click="visible = true">新增角色</el-button>
    </div>

    <!-- 查询区域 -->


    <!-- 表格区域 -->
    <el-table :data="tableList" style="flex:1;" v-loading="loading">
      <el-table-column prop="roleId" label="序号" width="80" />
      <el-table-column prop="roleName" label="角色名称" width="180" />
      <el-table-column prop="roleDesc" label="角色描述" width="180" />
      <el-table-column label="权限范围">
        <template #default="scope">
          {{ getRoleText(scope.row.roleJson) }}
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="editItem(scope.row)">编辑</el-button>
          <el-popconfirm title="确定要删除吗？" @confirm="deleteItem(scope.row.roleId)">
            <template #reference>
              <el-button link type="primary" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 新增或编辑的抽屉 -->
  <sDrawer v-model="visible" :title="form.roleId ? '编辑角色' : '新增角色'" size="35%" :close-on-click-modal="false">
    <el-form :model="form" label-width="80px" ref="ruleFormRef">
      <el-form-item label="角色名称:">
        <el-input v-model="form.roleName" />
      </el-form-item>
      <el-form-item label="角色描述:">
        <el-input v-model="form.roleDesc" />
      </el-form-item>
      <el-form-item label="权限选择:">

        <div>
          <div>
            <div>
              <el-checkbox v-model="form.roleJson.userCheckAll"
                :indeterminate="form.roleJson.user?.length > 0 && form.roleJson.user.length < origin.user.length"
                @change="userCheckAllChange">用户</el-checkbox>
            </div>
            <div>
              <el-checkbox-group v-model="form.roleJson.user" @change="userChange">
                <el-checkbox :label="item" v-for="(item, index) in origin.user" :key="index">{{ item }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <div style="margin-top:20px;">
            <div>
              <el-checkbox v-model="form.roleJson.contentCheckAll"
                :indeterminate="form.roleJson.content?.length > 0 && form.roleJson.content.length < origin.content.length"
                @change="contentCheckAllChange">内容管理</el-checkbox>
            </div>
            <div>
              <el-checkbox-group v-model="form.roleJson.content" @change="contentChange">
                <el-checkbox :label="item" v-for="(item, index) in origin.content" :key="index">{{ item }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <div style="margin-top:20px;">
            <div>
              <el-checkbox v-model="form.roleJson.quizCheckAll"
                :indeterminate="form.roleJson.quiz?.length > 0 && form.roleJson.quiz.length < origin.quiz.length"
                @change="quizCheckAllChange">问卷</el-checkbox>
            </div>
            <div>
              <el-checkbox-group v-model="form.roleJson.quiz" @change="quizChange">
                <el-checkbox :label="item" v-for="(item, index) in origin.quiz" :key="index">{{ item }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <div style="margin-top:20px;">
            <div>
              <el-checkbox v-model="form.roleJson.externalCheckAll"
                :indeterminate="form.roleJson.external?.length > 0 && form.roleJson.external.length < origin.external.length"
                @change="externalCheckAllChange">外部问卷</el-checkbox>
            </div>
            <div>
              <el-checkbox-group v-model="form.roleJson.external" @change="externalChange">
                <el-checkbox :label="item" v-for="(item, index) in origin.external" :key="index">{{ item }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <div style="margin-top:20px;">
            <div>
              <el-checkbox v-model="form.roleJson.messageCheckAll"
                :indeterminate="form.roleJson.message?.length > 0 && form.roleJson.message.length < origin.message.length"
                @change="messageCheckAllChange">消息管理</el-checkbox>
            </div>
            <div>
              <el-checkbox-group v-model="form.roleJson.message" @change="messageChange">
                <el-checkbox :label="item" v-for="(item, index) in origin.message" :key="index">{{ item }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <div style="margin-top:20px;">
            <div>
              <el-checkbox v-model="form.roleJson.qrcodeCheckAll"
                :indeterminate="form.roleJson.qrcode?.length > 0 && form.roleJson.qrcode.length < origin.qrcode.length"
                @change="qrcodeCheckAllChange">活码管理</el-checkbox>
            </div>
            <div>
              <el-checkbox-group v-model="form.roleJson.qrcode" @change="qrcodeChange">
                <el-checkbox :label="item" v-for="(item, index) in origin.qrcode" :key="index">{{ item }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <div style="margin-top:20px;">
            <div>
              <el-checkbox v-model="form.roleJson.accountCheckAll"
                :indeterminate="form.roleJson.account?.length > 0 && form.roleJson.account.length < origin.account.length"
                @change="accountCheckAllChange">权限管理</el-checkbox>
            </div>
            <div>
              <el-checkbox-group v-model="form.roleJson.account" @change="accountChange">
                <el-checkbox :label="item" v-for="(item, index) in origin.account" :key="index">{{ item }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

        </div>

      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="saveData()">确定</el-button>
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
        this.form = {
          roleJson: {
            userCheckAll: false,
            user: [],
            contentCheckAll: false,
            content: [],
            quizCheckAll: false,
            quiz: [],
            externalCheckAll: false,
            external: [],
            messageCheckAll: false,
            message: [],
            qrcodeCheckAll: false,
            qrcode: [],
            accountCheckAll: false,
            account: [],
          },
        }
      }
    }
  },
  data() {
    return {
      origin: {
        user: ['用户列表', '注销审核'],
        content: ['经销商', '产品内容', '轮播图配置', '海报模板', '数据问候语'],
        quiz: ['睡眠质量题目', '失眠题目', '面罩题目'],
        external: ['外部问卷管理'],
        message: ['站内信', '小程序消息', '模板管理'],
        qrcode: ['小程序码', '企微活码'],
        account: ['账户列表', '角色管理', '操作日志'],
      },
      form: {
        roleJson: {
          userCheckAll: false,
          user: [],
          contentCheckAll: false,
          content: [],
          quizCheckAll: false,
          quiz: [],
          externalCheckAll: false,
          external: [],
          messageCheckAll: false,
          message: [],
          qrcodeCheckAll: false,
          qrcode: [],
          accountCheckAll: false,
          account: [],
        },
      },
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
      const res = await this.$request.get('/resmed/admin/modules/role/list')
      if (res.data.code === 200) {
        this.tableList = res.data.data
      }
      this.loading = false
    },
    async saveData() {
      const res = await this.$request.post(this.form.roleId ? '/resmed/admin/modules/role/update_role' : '/resmed/admin/modules/role/add_role', this.form)
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
    async deleteItem(id) {
      const res = await this.$request.get("/resmed/admin/modules/role/delete_role?id=" + id)
      if (res.data.code === 200) {
        this.$message.success(res.data.message)
        this.getList()
      }
    },
    getRoleText(roleJson) {
      let arr = []
      for (const key in roleJson) {
        if (Array.isArray(roleJson[key])) {
          arr = [...arr, ...roleJson[key]]
        }
      }
      return arr.join('、')
    },
    userCheckAllChange() {
      if (this.form.roleJson.userCheckAll) {
        this.form.roleJson.user = this.origin.user
      } else {
        this.form.roleJson.user = []
      }
    },
    contentCheckAllChange() {
      if (this.form.roleJson.contentCheckAll) {
        this.form.roleJson.content = this.origin.content
      } else {
        this.form.roleJson.content = []
      }
    },
    quizCheckAllChange() {
      if (this.form.roleJson.quizCheckAll) {
        this.form.roleJson.quiz = this.origin.quiz
      } else {
        this.form.roleJson.quiz = []
      }
    },
    externalCheckAllChange() {
      if (this.form.roleJson.externalCheckAll) {
        this.form.roleJson.external = this.origin.external
      } else {
        this.form.roleJson.external = []
      }
    },
    messageCheckAllChange() {
      if (this.form.roleJson.messageCheckAll) {
        this.form.roleJson.message = this.origin.message
      } else {
        this.form.roleJson.message = []
      }
    },
    qrcodeCheckAllChange() {
      if (this.form.roleJson.qrcodeCheckAll) {
        this.form.roleJson.qrcode = this.origin.qrcode
      } else {
        this.form.roleJson.qrcode = []
      }
    },
    accountCheckAllChange() {
      if (this.form.roleJson.accountCheckAll) {
        this.form.roleJson.account = this.origin.account
      } else {
        this.form.roleJson.account = []
      }
    },
    userChange(value) {
      const checkedCount = value.length
      this.form.roleJson.userCheckAll = checkedCount === this.origin.user.length
    },
    contentChange(value) {
      const checkedCount = value.length
      this.form.roleJson.contentCheckAll = checkedCount === this.origin.content.length
    },
    quizChange(value) {
      const checkedCount = value.length
      this.form.roleJson.quizCheckAll = checkedCount === this.origin.quiz.length
    },
    externalChange(value) {
      const checkedCount = value.length
      this.form.roleJson.externalCheckAll = checkedCount === this.origin.external.length
    },
    messageChange(value) {
      const checkedCount = value.length
      this.form.roleJson.messageCheckAll = checkedCount === this.origin.message.length
    },
    qrcodeChange(value) {
      const checkedCount = value.length
      this.form.roleJson.qrcodeCheckAll = checkedCount === this.origin.qrcode.length
    },
    accountChange(value) {
      const checkedCount = value.length
      this.form.roleJson.accountCheckAll = checkedCount === this.origin.account.length
    },
  }
}
</script>

<style scoped></style>