import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress' //进度条
import 'nprogress/nprogress.css'

NProgress.configure({
  showSpinner: false //通过将其设置为 false 来关闭加载微调器。
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/order/list',
      hidden: true,
    },
    {
      path: '/login',
      name: 'login',
      meta: { title: "登陆" },
      component: () => import("@/views/login/login.vue"),
      hidden: true,
    },
    {
      path: '/order',
      name: 'order',
      meta: { title: "订单" },
      component: () => import("@/views/main/main.vue"),
      children: [
        {
          path: 'list',
          name: 'order-list',
          meta: { title: "订单列表" },
          component: () => import("@/views/order/order-list.vue"),
        },
        {
          path: 'info',
          name: 'order-info',
          meta: { title: "订单详情" },
          component: () => import("@/views/order/order-info.vue"),
        },
      ]
    },
    {
      path: '/product',
      name: 'product',
      meta: { title: "商品" },
      component: () => import("@/views/main/main.vue"),
      children: [
        {
          path: 'list',
          name: 'product-list',
          meta: { title: "商品列表" },
          component: () => import("@/views/product/product-list.vue"),
        },
        {
          path: 'info',
          name: 'product-info',
          meta: { title: "商品详情" },
          component: () => import("@/views/product/product-info.vue"),
        },
      ]
    },
    {
      path: '/coupon',
      name: 'coupon',
      meta: { title: "优惠券" },
      component: () => import("@/views/main/main.vue"),
      children: [
        {
          path: 'list',
          name: 'coupon-list',
          meta: { title: "优惠券列表" },
          component: () => import("@/views/coupon/coupon-list.vue"),
        },
        {
          path: 'info',
          name: 'coupon-info',
          meta: { title: "优惠券详情" },
          component: () => import("@/views/coupon/coupon-info.vue"),
        },
        {
          path: 'info-new',
          name: 'coupon-info-new',
          meta: { title: "优惠券详情-new" },
          component: () => import("@/views/coupon/coupon-info-new.vue"),
        },
      ]
    },
    {
      path: '/user',
      name: 'user',
      meta: { title: "用户" },
      component: () => import("@/views/main/main.vue"),
      children: [
        {
          path: 'list',
          name: 'user-list',
          meta: { title: "用户列表" },
          component: () => import("@/views/user/user-list.vue"),
        },
        {
          path: 'info',
          name: 'user-info',
          meta: { title: "用户详情" },
          component: () => import("@/views/user/user-info.vue"),
        },
        {
          path: 'quiz',
          name: 'user-quiz',
          meta: { title: "用户问卷" },
          component: () => import("@/views/user/user-quiz.vue"),
        },
      ]
    },
    {
      path: '/member',
      name: 'member',
      meta: { title: "会员" },
      component: () => import("@/views/main/main.vue"),
      children: [
        {
          path: 'list',
          name: 'member-list',
          meta: { title: "会员列表" },
          component: () => import("@/views/member/member-list.vue"),
        },
        {
          path: 'config',
          name: 'member-config',
          meta: { title: "会员配置" },
          component: () => import("@/views/member/member-config.vue"),
        },
        {
          path: 'interest',
          name: 'member-interest',
          meta: { title: "会员权益" },
          component: () => import("@/views/member/member-interest.vue"),
        },
      ]
    },
    {
      path: '/point',
      name: 'point',
      meta: { title: "积分商城" },
      component: () => import("@/views/main/main.vue"),
      children: [
        {
          path: 'product-list',
          name: 'point-product-list',
          meta: { title: "积分商品列表" },
          component: () => import("@/views/point/point-product-list.vue"),
        },
        {
          path: 'product-info',
          name: 'point-product-info',
          meta: { title: "积分商品详情" },
          component: () => import("@/views/point/point-product-info.vue"),
        },
        {
          path: 'category',
          name: 'point-category',
          meta: { title: "积分商品类目配置" },
          component: () => import("@/views/point/point-category.vue"),
        },
        {
          path: 'order-list',
          name: 'point-order-list',
          meta: { title: "积分订单列表" },
          component: () => import("@/views/point/point-order-list.vue"),
        },
        {
          path: 'order-info',
          name: 'point-order-info',
          meta: { title: "积分订单详情" },
          component: () => import("@/views/point/point-order-info.vue"),
        },
      ]
    },
    {
      path: '/task',
      name: 'task',
      meta: { title: "任务" },
      component: () => import("@/views/main/main.vue"),
      children: [
        {
          path: 'list',
          name: 'task-list',
          meta: { title: "任务管理" },
          component: () => import("@/views/task/task-list.vue"),
        },
      ]
    },
    {
      path: '/quiz',
      name: 'quiz',
      meta: { title: "问卷" },
      component: () => import("@/views/main/main.vue"),
      children: [
        {
          path: 'list',
          name: 'quiz-list',
          meta: { title: "问卷管理" },
          component: () => import("@/views/quiz/quiz-list.vue"),
        },
      ]
    },
    {
      path: '/ceshi',
      name: 'ceshi',
      meta: { title: "问卷" },
      component: () => import("@/views/main/main.vue"),
      children: [
        {
          path: 'fome',
          name: 'ceshi-fome',
          meta: { title: "测试一" },
          component: () => import("@/views/ceshi/ceshi-fome.vue"),
        },
        {
          path: 'fomeinfo',
          name: 'fome-info',
          meta: { title: "商品详情" },
          component: () => import("@/views/ceshi/fome-info.vue"),
        },
      ]
    },
    {
      path: '/account',
      name: 'account',
      meta: { title: "权限管理" },
      component: () => import("@/views/main/main.vue"),
      children: [
        {
          path: 'list',
          name: 'account-list',
          meta: { title: "账户列表" },
          component: () => import("@/views/account/account-list.vue"),
        },
        {
          path: 'role',
          name: 'account-role',
          meta: { title: "角色管理" },
          component: () => import("@/views/account/account-role.vue"),
        },
        {
          path: 'log',
          name: 'account-log',
          meta: { title: "操作日志" },
          component: () => import("@/views/account/account-log.vue"),
        },
      ]
    },
  ]
})

import defaultSettings from '@/settings'

//路由全局前置钩子
router.beforeEach((to, from, next) => {
  NProgress.start()
  document.title = `${to.meta.title || '数智兴华'}-${defaultSettings.title}`
  let token = localStorage.getItem("token")
  if (token) {
    next()
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  }
});

// //路由全局后置钩子
router.afterEach(() => {
  NProgress.done()
});

export default router
