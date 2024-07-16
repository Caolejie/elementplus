<template>
  <el-container>
    <el-aside>
      <el-menu :default-active="$route.path" :collapse="false" active-text-color="#fff" background-color="#011528"
        text-color="hsla(0,0%,100%,.65)" style="height:100%;" :collapse-transition="true">
        <div v-for="route in routes" :key="route.path">
          <el-sub-menu :index="route.path" v-if="!route.hidden">
            <template #title>
              <el-icon>
                <document />
              </el-icon>
              <span>{{route.meta.title}}</span>
            </template>
            <el-menu-item :index="resolvePath(route.path,child.path)" v-for="child in route.children" :key="child.path">{{child.meta.title}}</el-menu-item>
          </el-sub-menu>
        </div>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <div style="display:flex;align-items: center;height: 100%;">
          <div @click="isCollapse = !isCollapse" class="hamburger-container">
            <el-icon :size="20" v-if="isCollapse">
              <Expand />
            </el-icon>
            <el-icon :size="20" v-else>
              <Fold />
            </el-icon>
          </div>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>homepage</el-breadcrumb-item>
            <el-breadcrumb-item>promotion list</el-breadcrumb-item>
            <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: true,
    }
  },
  computed: {
    routes() {
      return this.$router.options.routes
    },
  },
  created() {
    console.log(this.$router.options)
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      console.log("this.$route", this.$route)
      const matched = this.$route.matched.filter(item => item.meta && item.meta.title)
    },
    resolvePath(basePath,routePath) {
      // const index = path.resolve(basePath, routePath)
      console.log(basePath,routePath)
      return routePath
    }
  },
}
</script>

<style scoped>
.el-container {
  height: 100vh;
}

.el-aside {
  color: #fff;
  /* width: fit-content;
  max-width: 200px; */
  overflow: hidden;
}

.el-header {
  height: 50px;
  display: flex;
  justify-content: space-between;
  padding: 0;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
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

.hamburger-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 100%;
  cursor: pointer;
  margin-right: 10px;
}

.hamburger-container:hover {
  background: rgba(0, 0, 0, 0.025);
}
</style>