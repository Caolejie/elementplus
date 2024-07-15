<script setup>
import {
  ref,
  reactive,
  nextTick,
  getCurrentInstance,
  onBeforeMount, //挂载之前
  onMounted, //挂载之后
  onBeforeUpdate, //数据更新之前
  onUpdated, //数据更新之后
  onBeforeUnmount, //即将销毁
  onUnmounted, //销毁完毕
} from 'vue'

//用 proxy 代替 vue2中的this
const { proxy } = getCurrentInstance()

if (proxy.$route.query.id) {
  getCouponInfo()
}


onMounted(() => {
  console.log(`the component is now mounted.`)
})

const msg = ref("msg") //除object对象外使用ref定义响应式变量
const obj = reactive({
  msg: "msg too"
}) //对象使用reactive定义响应式变量
</script>

<template>
  1
</template>

<style scoped>

</style>
