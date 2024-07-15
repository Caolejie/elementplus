<template>
  <div v-if="target" style="color:#909399;font-size:14px;">选择后将会跳到题目ID:{{target}}</div>
  <div v-for="questionRelationItem in antecedent" :key="questionRelationItem" style="color:#909399;font-size:14px;">
    <div v-show="antecedent.length >= 1">
      依赖于题目:{{ questionRelationItem.text }}
      {{ getLogicTypeText(questionRelationItem.type) }}
      <span v-for="choice in questionRelationItem.list" :key="choice.choiceId"> {{ choice.text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    antecedent: {
      type: Array,
      default: () => ([]),
    },
    target: {
      type: Number,
      default: null,
    }
  },
  data() {
    return {};
  },
  computed: {
    getLogicTypeText() {
      return (type) => {
        if (type == "all") {
          return "只选择"
        } else if (type == "include") {
          return "选项包括"
        } else if (type == "exclude") {
          return "选项不包括"
        } else {
          return "未知"
        }
      }
    },
  },
  created() { },
  methods: {

  },
};
</script>