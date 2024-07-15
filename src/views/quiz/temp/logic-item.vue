<template>
  <el-form-item :label="'绑定题目' + (qrIndex + 1) + ':'" v-for="(qrItem, qrIndex) in antecedent" :key="qrIndex">
    <div style="width:100%;display:flex;">
      <el-select size="small" v-model="qrItem.preQuestionId" @change="qrItemSelectChenge(qrItem)" placeholder="请选择"
        style="margin-right:10px;flex:1;">
        <el-option v-for="reQItem in tableList" :key="reQItem.questionId" :label="reQItem.text"
          :value="reQItem.questionId"></el-option>
      </el-select>
      <el-button size="small" circle @click="antecedent.push({})" v-if="qrIndex === 0">
        <el-icon>
          <plus />
        </el-icon>
      </el-button>
      <el-button size="small" circle @click="antecedent.splice(qrIndex, 1)" v-else>
        <el-icon>
          <minus />
        </el-icon>
      </el-button>
    </div>
    <div v-if="!!qrItem.preQuestionId" style="margin-top:5px">
      <div style="display: flex;align-items: center;"> 当"绑定题目{{ qrIndex + 1 }}":
        <el-select v-model="qrItem.type" placeholder="请选择条件" style="width:120px;" size="small"
          @change="qrItem.qrChoiceList = []">
          <el-option label="只选择" value="all"></el-option>
          <el-option label="选项包括" value="include"></el-option>
          <el-option label="选项不包括" value="exclude"></el-option>
        </el-select>
        下面的选项时"当前题目"才出现:
      </div>
      <div v-if="qrItem.type">
        <div v-if="getQuestionType(qrItem.preQuestionId) !== 'input'">
          <!-- 绑定题目的选项-单选题 -->
          <el-radio-group v-if="getQuestionType(qrItem.preQuestionId) == 'radio' && qrItem.type == 'all'"
            v-model="qrItem.qrChoiceList[0]"
            @change="checkboxChange(qrItem, getQuestionOptions(qrItem.preQuestionId), qrItem.qrChoiceList)">
            <el-radio v-for="(optionItem, optionIndex) in getQuestionOptions(qrItem.preQuestionId)" :key="optionIndex"
              :label="optionItem.optionId">{{ optionItem.text }}</el-radio>
          </el-radio-group>

          <!-- 绑定题目的选项-多选题 -->
          <el-checkbox-group v-else v-model="qrItem.qrChoiceList"
            @change="checkboxChange(qrItem, getQuestionOptions(qrItem.preQuestionId), qrItem.qrChoiceList)">
            <el-checkbox v-for="(optionItem, optionIndex) in getQuestionOptions(qrItem.preQuestionId)"
              :key="optionIndex" :label="optionItem.optionId">{{ optionItem.text }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div v-else>填空题暂不支持设置</div>
      </div>
    </div>
  </el-form-item>
</template>

<script>
export default {
  props: {
    antecedent: {
      type: Array,
      default: () => ([]),
    },
    tableList: {
      type: Array,
      default: () => ([]),
    }
  },
  data() {
    return {};
  },
  computed: {
    // questionId获取题目类型
    getQuestionType() {
      return (id) => {
        let type = ""
        this.tableList.forEach((item) => {
          if (item.questionId == id) {
            type = item.type
            return
          }
        })
        return type
      }
    },
    // qusetionId获取options
    getQuestionOptions() {
      return (id) => {
        let options = []
        this.tableList.forEach((item) => {
          if (item.questionId == id) {
            options = item.options
            return
          }
        })
        return options
      }
    },
  },
  created() { },
  methods: {
    // 问题-前置题目选择器改变
    qrItemSelectChenge(qrItem) {
      qrItem.qrChoiceList = []
      qrItem.text = this.getResQuestionItem(qrItem.preQuestionId).text
    },
    // questionId获取题目Item
    getResQuestionItem(id) {
      let qItem = {}
      this.tableList.forEach(item => {
        if (item.questionId == id) {
          qItem = item
          return
        }
      })
      return qItem
    },
    //多选框改变
    checkboxChange(rItem, all, check) {
      let checkList = []
      check.forEach((check) => {
        all.forEach((all) => {
          if (all.optionId === check) {
            checkList.push({ choiceId: all.optionId, text: all.text })
          }
        })
      })
      rItem.list = this.$deepClone(checkList)
    },
  },
};
</script>