<template>
  <div style="height:100%;display:flex;flex-direction:column;">
    <div style="margin-bottom:10px;">
      <el-button type="primary" @click="dialogQuestion = true">新增题目</el-button>
    </div>

    <!-- 表格区域 -->
    <el-table :data="tableList" height="100%" style="flex:1" v-loading="loading">
      <el-table-column label="排序" width="80" align="center">
        <template #default="scope">
          <div>
            <div v-if="!scope.row.editSort" @click="showSortInput(scope.row)" style="cursor: pointer;">
              {{scope.row.sort}}
            </div>
            <el-input :ref="'qSort' + scope.row.questionId" v-else v-model="scope.row.sort" @change="sortChange(scope.row)" @blur="scope.row.editSort=false" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="text" label="题目" width="500" />
      <el-table-column prop="text" label="逻辑">
        <template #default="scope">
          <div>
            <div v-if="scope.row.antecedent.length != 0">
              <div style="font-weight:700;margin:5px 0 5px 0;">题目前置:</div>
              <div v-for="(qrItem, qrIndex) in scope.row.antecedent" :key="qrIndex">
                {{ qrIndex + 1 }}.{{ qrItem.text }}
                {{ getType(qrItem.type) }}
                <span v-for="choiceItem in qrItem.list" :key="choiceItem.choiceId"> {{ choiceItem.text }}</span>
              </div>
            </div>
            <div v-else style="font-weight:700;margin:5px 0 5px 0;">无题目前置</div>
            <div>
            <div v-for="(orItem,orIndex) in scope.row.options" :key="orIndex" v-show="orItem.antecedent.length > 0 || orItem.target">
              <div style="font-weight:700;margin:10px 0 5px 0;">选项:{{orItem.text}}</div>
              <div v-if="orItem.target" style="color:#909399;font-size:14px;">选择后将会跳到题目ID:{{orItem.target}}</div>
              <template v-if="orItem.antecedent.length > 0">
                <span v-for="oorItem in orItem.antecedent" :key="oorItem.preQuestionId"
                  style="color:#909399;">(依赖于题目:{{oorItem.text}} {{getType(oorItem.type)}}
                  <span v-for="choice in oorItem.list" :key="choice.choiceId">{{choice.text}}</span>)
                </span>
              </template>
            </div>
          </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="题目类型" width="100">
        <template #default="scope">
          {{ getQuestionTypeText(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="editItem(scope.row)">编辑</el-button>
          <el-popconfirm title="确定要删除吗?" @confirm="deleteItem(scope.row.questionId)">
            <template #reference>
              <el-button link type="primary" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-box">
      <!-- total, prev, pager, next, sizes -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total" :total="totalNum" :currentPage="search.page"
        :pageSize="search.pageSize">
      </el-pagination>
    </div>

  </div>

  <!-- 新增或编辑题目的抽屉 -->
  <sDrawer v-model="dialogQuestion" :title="form.questionId ? '编辑题目' : '新增题目'" size="50%" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" label-width="60px" ref="ruleFormRef">
      <el-form-item label="ID:" prop="text" v-if="form.questionId">
        {{ form.questionId }}
      </el-form-item>
      <el-form-item label="标题:" prop="text">
        <el-input v-model="form.text" />
      </el-form-item>
      <el-form-item label="副标题:">
        <el-input v-model="form.desc" />
      </el-form-item>
      <el-form-item label="图片:">
        <uploadImage v-model="form.image"></uploadImage>
      </el-form-item>
      <el-form-item label="类型:" prop="type">
        <el-select v-model="form.type" placeholder="请选择题目类型" @change="qTypeSelectChange()">
          <el-option label="单选题" value="radio" />
          <el-option label="多选题" value="multiple" />
          <el-option label="输入题" value="input" />
        </el-select>
      </el-form-item>

      <el-form-item :label="'选项' + (oIndex + 1) + ':'" v-for="(oItem, oIndex) in form.options" :key="oIndex">
        <div style="display:flex;width:100%;align-items: center;">
          <el-input v-model="oItem.text" style="margin-right:10px;" />
          <el-button link type="primary" @click="oItem.more = !oItem.more"
            :class="{ badge: oItem.desc1 || oItem.desc2 || oItem.image }">{{ oItem.more ? '收起' : '更多' }}</el-button>
          <el-button size="small" circle @click="form.options.splice(oIndex, 1)" v-if="form.options.length > 1">
            <el-icon>
              <minus />
            </el-icon>
          </el-button>
          <el-button size="small" circle @click="form.options.push({ antecedent: [] })">
            <el-icon>
              <plus />
            </el-icon>
          </el-button>
        </div>

        <div class="option-item-desc" :style="{ height: oItem.more ? '100px' : '0px' }">
          <uploadImage v-model="oItem.image"></uploadImage>
          <div
            style="margin-left:5px;flex:1;margin-right: 70px;display: flex;flex-direction: column;justify-content: space-around;">
            <div style="display:flex;width:100%;">
              <div style="width:50px;">描述1:</div>
              <el-input size="small" v-model="oItem.desc1" style="flex:1;" />
            </div>
            <div style="display:flex;width:100%;">
              <div style="width:50px;">描述2:</div>
              <el-input size="small" v-model="oItem.desc2" style="flex:1;" />
            </div>
          </div>
        </div>

        <div>
          <logicShow :antecedent="oItem.antecedent" :target="oItem.target"></logicShow>
        </div>
      </el-form-item>

      <div>
        <logicShow :antecedent="form.antecedent"></logicShow>
      </div>

      <div class="logic-box">
        <div>逻辑设置：</div>
        <el-button link type="primary" @click="clickLogicBtn('题目关联')">题目关联</el-button>
        <el-button link type="primary" @click="clickLogicBtn('选项关联')">选项关联</el-button>
        <el-button link type="primary" @click="clickLogicBtn('题目跳转')">题目跳转</el-button>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="dialogQuestion = false">取消</el-button>
      <el-button type="primary" @click="formValidate()">确定</el-button>
    </template>
  </sDrawer>

  <!-- 题目逻辑配置的弹窗 -->
  <el-dialog v-model="dialogLogic" :title="dialogLogicTitle" :close-on-click-modal="false">
    <el-form :model="form" label-width="90px">
      <el-form-item label="当前题目:">{{ form.text }}</el-form-item>
      <div v-if="dialogLogicTitle == '题目关联'">
        <logicItem :antecedent="form.antecedent" :tableList="tableList"></logicItem>
      </div>
      <div v-else-if="dialogLogicTitle == '选项关联'">
        <el-table :data="form.options" border style="width: 100%">
          <el-table-column prop="text" label="当前选项" width="200"></el-table-column>
          <el-table-column label="选项出现的条件">
            <template #default="scope">
              <el-button link type="primary" size="small" v-if="scope.row.antecedent.length == 0"
                @click="addOptionsRelation(scope.row)">添加关联</el-button>
              <div v-else>
                <logicItem :antecedent="scope.row.antecedent" :tableList="tableList"></logicItem>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else-if="dialogLogicTitle == '题目跳转'">
        <el-table :data="form.options" border style="width: 100%">
          <el-table-column prop="text" label="当前选项" width="200"></el-table-column>
          <el-table-column label="选择后跳转的题目">
            <template #default="scope">
              <el-select v-model="scope.row.target" placeholder="请选择跳转题目" size="small" style="width:100%;" clearable>
                <el-option v-for="reQItem in tableList" :key="reQItem.questionId" :label="reQItem.text"
                  :value="reQItem.questionId"></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="deleteLogicItem()">删除逻辑</el-button>
      <el-button type="primary" @click="dialogLogic = false">保存</el-button>
    </template>
  </el-dialog>

</template>

<script>
import sDrawer from "@/components/s-drawer/s-drawer.vue"
import uploadImage from "@/components/upload-image/upload-image.vue"
import logicItem from "./temp/logic-item.vue"
import logicShow from "./temp/logic-show.vue"
export default {
  components: {
    sDrawer,
    logicItem,
    logicShow,
    uploadImage
  },
  watch: {
    dialogQuestion(value) {
      if (!value) {
        this.$refs.ruleFormRef.resetFields()
        this.form = {}
      }
    }
  },
  data() {
    return {
      loading: false,
      totalNum: 0,
      search: {
        page: 1,
        pageSize: 100,
      },
      dialogQuestion: false, //弹窗
      dialogLogic: false, //逻辑抽屉
      dialogLogicTitle: '',
      tableList: [],
      form: {}, //表单
      rules: {
        text: [{ required: true, message: "请填写题目标题", trigger: "blur" }],
        type: [{ required: true, message: "请选择题目类型", trigger: "change" }],
      }
    }
  },
  computed: {
    // type获取题目类型文本
    getQuestionTypeText() {
      return (type) => {
        if (type == "multiple") {
          return "多选题"
        } else if (type == "radio") {
          return "单选题"
        } else if (type == "input") {
          return "输入题"
        } else {
          return "未定义"
        }
      }
    },
    getType() {
      return (type) => {
        if (type == "all") {
          return "只选择";
        } else if (type == "include") {
          return "选项包括";
        } else if (type == "exclude") {
          return "选项不包括";
        } else {
          return "";
        }
      };
    },
  },
  created() {
    this.getQuestionList()
  },
  methods: {
    // 获取题目列表
    async getQuestionList() {
      this.loading = true
      const res = await this.$request.get("/api-mall/admin/api/v1/document/find_questions_by_page", { params: this.search })
      if (res.data.code === 200) {
        this.tableList = res.data.data.list
        this.totalNum = res.data.data.total
      }
      this.loading = false
    },
    // 点击编辑
    editItem(row) {
      this.form = this.$deepClone(row)
      this.dialogQuestion = true
    },
    // 点击删除
    async deleteItem(id) {
      const res = await this.$request.post("/api-mall/admin/api/v1/document/delete_questions", [id])
      if (res.data.code === 200) {
        this.$message.success(res.data.message)
        this.getQuestionList()
      }
    },
    // 表单校验
    formValidate() {
      this.$refs.ruleFormRef.validate((valid) => {
        if (valid) { //表单校验成功
          this.postData()
        }
      })
    },
    // 发送数据
    async postData() {
      let url = this.form.questionId ? "/api-mall/admin/api/v1/document/update_questions" : "/api-mall/admin/api/v1/document/insert_questions"
      const res = await this.$request.post(url, [this.form]);
      if (res.data.code === 200) {
        this.$message.success(res.data.message)
        this.dialogQuestion = false
        this.getQuestionList()
      }
    },
    // 题目类型改变
    qTypeSelectChange() {
      if (this.form.type == 'input') {
        delete this.form.options
      } else {
        if (Array.isArray(this.form.options) && this.form.options.length) {
          // 如果这是数组且长度不为0
        } else {
          this.form.options = [{ antecedent: [] }]
        }
      }
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.search.pageSize = val
      this.getQuestionList()
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.search.page = val
      this.getQuestionList()
    },
    // 点击逻辑设置三个按钮
    clickLogicBtn(val) {
      if (val == '题目关联') {
        if (!Array.isArray(this.form.antecedent)) {
          this.form.antecedent = []
        }
        if (this.form.antecedent.length === 0) {
          this.form.antecedent.push({})
        }
      }
      this.dialogLogicTitle = val
      this.dialogLogic = true
    },
    // 删除本题关联
    deleteLogicItem() {
      if (this.dialogLogicTitle == '题目关联') {
        this.form.antecedent = []
      } else if (this.dialogLogicTitle == '选项关联') {
        this.form.options.forEach((item) => {
          item.antecedent = []
        })
      } else if (this.dialogLogicTitle == '题目跳转') {
        this.form.options.forEach((item) => {
          item.target = null
        })
      }
      this.dialogLogic = false
    },
    // 添加选项出现的条件
    addOptionsRelation(opItem) {
      console.log(opItem)
      opItem.antecedent = [{}]
    },
    // 排序改变
    async sortChange(row) {
      const res = await this.$request.get("/api-mall/admin/api/v1/document/update_questions_sort", {
        params: {
          questionId: row.questionId,
          newSortId: row.sort
        }
      })
      if (res.data.code === 200) {
        this.getQuestionList()
        this.$message.success(res.data.message)
      }
    },
    // 显示排序输入框
    showSortInput(row){
      row.editSort = true
      this.$nextTick(()=>{
        this.$refs['qSort' + row.questionId].focus()
      })
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

.logic-box {
  margin-top: 10px;
  padding: 0 10px;
  height: 40px;
  background-color: #f4f4f4;
  border: 1px dashed #dbdbdb;
  display: flex;
  align-items: center;
}

.option-item-desc {
  margin-top: 5px;
  display: flex;
  width: 100%;
  height: auto;
  transition: all 0.25s linear;
  overflow: hidden;
}

.badge {
  position: relative;
}

.badge::after {
  content: "";
  position: absolute;
  top: -3px;
  right: 0;
  background-color: #f56c6c;
  width: 5px;
  height: 5px;
  border-radius: 50%;
}
</style>