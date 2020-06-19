<template>
  <el-container class="container">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        style="border: 0;"
        class="auto-el-menu"
        :collapse="isCollapse"
        :default-active="$route.path"
        background-color="#00142a"
        text-color="white"
        active-text-color="white"
        :router="true"
        :default-openeds="['3']"
      >
        <sidebar-item
          v-for="route in routers"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
    <el-container>
      <!-- 面包屑 -->
      <el-header>
        <el-breadcrumb separator="/" style="margin-top: 20px">
          <el-breadcrumb-item @click.native="switchCollapse" style="cursor: pointer;">
            <icon-font iconClass="dakaisanshu"></icon-font>
          </el-breadcrumb-item>
          <el-breadcrumb-item>自动化测试</el-breadcrumb-item>
          <el-breadcrumb-item>{{ breadTextOne }}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="breadTextTwo">{{ breadTextTwo }}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <!-- 页面主体 -->
      <el-main style="padding: 0 20px!important;">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import SidebarItem from "@/pages/autotest/components/SidebarItem.vue";
import autoTestRouter from "@/router/modules/autotest1.js";
import { mapGetters } from "vuex";
export default {
  components: { SidebarItem },
  computed: {
    // ...mapGetters(["siderBarData"])
    routes() {
      return this.$store.getters.getSiderBarData;
    }
  },
  data() {
    debugger;
    return {
      routers: autoTestRouter,
      isCollapse: false,
      defaultActive: "random",
      breadTextOne: "monkey测试",
      breadTextTwo: "测试报告"
    };
  },
  created() {
    debugger;
    console.log(this.routes);
  },
  methods: {
    // 伸缩侧边栏
    switchCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 通过当前路由,确定侧边栏active,面包屑文案
    setDefaultActive() {
      // console.log(autoTestAsiderRouter);
      this.defaultActive = this.$route.meta.active;
      this.breadTextOne = this.$route.meta.breadTextOne;
      this.breadTextTwo = this.$route.meta.breadTextTwo;
    }
  },
  created() {
    this.$nextTick(() => {
      this.setDefaultActive();
    });
  },
  watch: {
    $route(newVal) {
      this.defaultActive = this.$route.meta.active;
      this.breadTextOne = newVal.meta.breadTextOne;
      this.breadTextTwo = newVal.meta.breadTextTwo;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  text-align: left;
  .aside {
    background-color: #00142a;
    .auto-el-menu:not(.el-menu--collapse) {
      width: 200px;
    }
  }
}
</style>

