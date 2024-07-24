<template>
  <div>
    <el-container>
    <el-aside :style="{ width: isCollapse ? 'fit-content' : '256px' }">
      <el-scrollbar>
        <div class="logo">数智兴华</div>
        <el-menu router :collapse="isCollapse" :default-active="$route.path" active-text-color="#fff"
          background-color="#011528" text-color="hsla(0,0%,100%,.65)" :collapse-transition="true">

          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <list />
              </el-icon>
              <span>订单</span>
            </template>
            <el-menu-item index="/order/list">订单列表</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="2">
            <template #title>
              <el-icon>
                <shopping-bag />
              </el-icon>
              <span>商品</span>
            </template>
            <el-menu-item index="/product/list">商品列表</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="3">
            <template #title>
              <el-icon>
                <user />
              </el-icon>
              <span>用户</span>
            </template>
            <el-menu-item index="/user/list">用户列表</el-menu-item>
            <el-menu-item index="/user/quiz">用户问卷</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="4">
            <template #title>
              <el-icon>
                <Avatar />
              </el-icon>
              <span>会员</span>
            </template>
            <el-menu-item index="/member/list">会员列表</el-menu-item>
            <el-menu-item index="/member/config">会员配置</el-menu-item>
            <!-- <el-menu-item index="/member/interest">权益中心</el-menu-item> -->
          </el-sub-menu>

          <el-sub-menu index="5">
            <template #title>
              <el-icon>
                <Coin />
              </el-icon>
              <span>积分商城</span>
            </template>
            <el-menu-item index="/point/product-list">积分商品列表</el-menu-item>
            <el-menu-item index="/point/category">商品类目配置</el-menu-item>
            <el-menu-item index="/point/order-list">积分订单列表</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="6">
            <template #title>
              <el-icon>
                <ticket />
              </el-icon>
              <span>优惠券</span>
            </template>
            <el-menu-item index="/coupon/list">优惠券列表</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="7">
            <template #title>
              <el-icon>
                <Paperclip />
              </el-icon>
              <span>任务</span>
            </template>
            <el-menu-item index="/task/list">任务管理</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="8">
            <template #title>
              <el-icon>
                <DocumentChecked />
              </el-icon>
              <span>问卷</span>
            </template>
            <el-menu-item index="/quiz/list">问卷管理</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="9">
            <template #title>
              <el-icon>
                <DocumentChecked />
              </el-icon>
              <span>测试</span>
            </template>
            <el-menu-item index="/ceshi/fome">测试1</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="10">
            <template #title>
              <el-icon>
                <DocumentChecked />
              </el-icon>
              <span>element</span>
            </template>
            <el-menu-item index="/element/basic">basic-demo</el-menu-item>
            <el-menu-item index="/element/form">form-demo</el-menu-item>
            <el-menu-item index="/element/feedback">feedback-demo</el-menu-item>
            <el-menu-item index="/element/navigation">navigation-demo</el-menu-item>
            <el-menu-item index="/element/others">others-demo</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="11">
            <template #title>
              <el-icon>
                <user />
              </el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/user-master/list">用户列表</el-menu-item>
            <!-- <el-menu-item index="/user-master/info">用户详情</el-menu-item> -->
          </el-sub-menu>

        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header>
        <div style="cursor: pointer;height:100%;padding: 0 12px;display: flex;align-items: center;"
          @click="isCollapse = !isCollapse">
          <el-icon color="#909399" :size="24" v-if="isCollapse">
            <Expand />
          </el-icon>
          <el-icon color="#909399" :size="24" v-else>
            <Fold />
          </el-icon>
        </div>
        <el-dropdown style="cursor: pointer;height:100%;display: flex;line-height: 60px;">
          <div style="padding: 0 12px;display: flex;align-items: center;justify-content: center;">
            <el-avatar :size="26"
              src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" />
            <span style="margin-left:10px;color:#909399;">{{ nickname }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item disabled>个人中心</el-dropdown-item>
              <el-dropdown-item disabled>个人设置</el-dropdown-item>
              <el-dropdown-item divided @click="quitLogin">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
  </div>
  
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      nickname: "",
      role: {},
    }
  },
  created() {
    this.nickname = localStorage.getItem("nickname");
  },
  methods: {
    quitLogin() {
      localStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功')
    }
  }
}
</script>

<style scoped>
.el-container {
  height: 100vh;
}

.el-aside {
  color: #fff;
  z-index: 10;
  background-color: #011528;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
}

.el-header {
  line-height: 60px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  z-index: 9;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.el-main {
  background-color: #f0f2f5;
  position: relative;
}

.el-menu {
  border: none;
}

.el-menu-item.is-active {
  background-color: #1890ff !important;
}

.el-menu-item {
  background-color: #000b16;
}

.el-menu-item:hover {
  color: #fff !important;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
}
</style>