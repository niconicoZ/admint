<template>
  <div class="user">
    <!-- 面包屑导航 -->
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>

    <!-- 搜索框 -->
    <el-row>
      <el-col :span="24">
          <!-- 给组件绑定原生事件的话，需要一个 .native -->
        <el-input placeholder="请输入内容" class="search-input" v-model="query" @keydown.native.enter="initList">
          <el-button slot="append" icon="el-icon-search" @click="initList"></el-button>
        </el-input>
        <el-button type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表单 -->
    <el-table :data="userList" border style="width: 100%">
      <!-- 表单序号 -->
      <el-table-column type="index" width="50"></el-table-column>
      <!-- 表单内容 -->
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <!-- 用户状态 -->
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="value3"></el-switch>
        </template>
      </el-table-column>
      <!-- 用户操作 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="primary" plain></el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger" plain></el-button>
          <el-button size="mini" icon="el-icon-check" type="warning" plain></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[1, 2, 3, 4]" 
        :page-size="1"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
//引入 获取列表用户数据请求
import { getUserList } from "@/app/axios.js";

export default {
  data() {
    return {
      userList: [],
      query:'', 
      total: 0, //默认显示共多少条数据
      pagesize: 1, //默认每页显示1条
      pagenum: 1, //默认当前第1页
      value3: ''
    };
  },
  created() {
    this.initList();
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      //获取每页显示多少条，把值传给data中，再把值传给请求中
      this.pagesize = val
      //在调用请求
      this.initList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      //获取当前点击的第几页
      this.pagenum = val
      this.initList()
    },
    //根据 接口要求 初始化列表请求
    initList() {
      getUserList({ params: { query: this.query, pagenum: this.pagenum, pagesize: this.pagesize } }).then(
        res => {
          console.log(res);
          this.userList = res.data.users;
          this.total = res.data.total
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.user {
  .search-input {
    width: 300px;
  }
  .page {
    padding: 5px 0;
    background-color: #d3dce6;
  }
}
</style>
