<template>
  <div class="home">
    <el-container>
      <!-- 左侧边栏：导航菜单 -->
      <el-aside width="auto">
        <div class="logo">

        </div>
        <el-menu
          default-active="2"
          class="el-menu-admin"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
                  用户列表
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-container>

        <!-- 头部 -->
        <el-header>
            <i class="myicon myicon-menu toggle-btn" @click='toggle'></i>
            <div class="system-title">
                电商后台管理系统
            </div>
            <div>
                <span class="welcome">
                    您好,{{ $store.getters.GetUsername }}
                </span>
                <el-button type="text" @click="logatuo">退出</el-button>
            </div>
        </el-header>
         
        <!-- 内容区域  -->
        <el-main>

           <router-view></router-view>

        </el-main>

      </el-container>
    </el-container>
  </div>
</template>

<script>
//引入获取列表数据请求
import { getUserList } from "@/app/axios.js";

export default {
  data() {
    return {
        isCollapse : false
    };
  },
  created() {
    let params = { params: { query: "", pagenum: 1, pagesize: 1 } };
    getUserList(params).then(res => {
      console.log(res);
    });
  },
  methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      toggle() {
         this.isCollapse = !this.isCollapse
      },
      logatuo() {
          //清除登陆状态，移出token值
          localStorage.removeItem('mytoken')
          //编程式导航到login页面
          this.$router.push({name: 'Login'})
      }
  }
};
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height:60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: #989898;
  }
  .toggle-btn {
    font-size: 36px;
    color: #989898;
    cursor: pointer;
    line-height: 60px;
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome, {
    color: white;
  }
}
</style>
