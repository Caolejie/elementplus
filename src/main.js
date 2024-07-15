import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import request, { hostURL } from '@/hooks/request.js'
import 'normalize.css/normalize.css' //重置默认css样式
import deepClone from "@/hooks/deepClone.js" //深拷贝函数
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { uploadFile } from '@/utils/utils.js'
import dayjs from 'dayjs'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.globalProperties.$request = request
app.config.globalProperties.$hostURL = hostURL
app.config.globalProperties.$deepClone = deepClone
app.config.globalProperties.$uploadFile = uploadFile
app.config.globalProperties.$dayjs = dayjs

app.use(router)
app.use(ElementPlus, { locale: zhCn })
app.mount('#app')
