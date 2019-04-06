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
        <el-input
          placeholder="请输入内容"
          class="search-input"
          v-model="query"
          @keydown.native.enter="initList"
        >
          <el-button slot="append" icon="el-icon-search" @click="initList"></el-button>
        </el-input>
        <el-button type="success" plain @click="addDialogFormVisible=true">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表单 -->
    <el-table 
    class="margin-20"
    :data="userList" 
    border 
    style="width: 100%" 
    v-loading="loading">
      <!-- 表单序号 -->
      <el-table-column type="index" width="50"></el-table-column>
      <!-- 表单内容 -->
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <!-- 用户状态 -->
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="ChangeUserState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <!-- 用户操作 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="primary"
            plain
            @click="showEdit(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            plain
            @click="showDelete(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            icon="el-icon-check"
            type="warning"
            plain
            @click="showGrant(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" label-width="80px" :rules="rules" ref="addUserFrom">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit('addUserFrom')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" label-width="80px" :rules="rules" ref="editUserFrom">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserSubmit('editUserFrom')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色 对话框 -->
    <el-dialog title="分配用户角色" :visible.sync="grantDialogFormVisible">
      <el-form :model="grantForm" label-width="120px">
        <el-form-item label="当前的用户名" prop="username">
          <el-tag type="info">{{ grantForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label="请选择角色">
          <el-select v-model="roleId" placeholder="请选择角色">
            <!-- 把获取到的用户角色信息 遍历给选择框中 -->
            <el-option
              v-for="(role,index) in rolesList"
              :key="index"
              :label="role.roleName"
              :value="role.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      {{ roleId }}
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantUserSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入 列表用户数据,更改用户状态请求,增加用户，根据ID获取用户信息，编辑用户信息,删除用户信息,获取全部角色列表,分配所有角色信息
import {
  getUserList,
  changeUserState,
  addUser,
  getUserById,
  editUser,
  deletetUser,
  rolesUser,
  grantUser
} from "@/app/axios.js";

export default {
  data() {
    return {
      userList: [],
      query: "",
      total: 0, //默认显示共多少条数据
      pagesize: 10, //默认每页显示1条
      pagenum: 1, //默认当前第1页
      addDialogFormVisible: false, //默认 添加用户对话框 隐藏
      addForm: {
        //定义添加对话框表单，绑定对话框的具体内容
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //添加用户的表单验证
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur,change"
          }
        ],
        mobile: [{ required: true, message: "电话不能为空" }]
      },
      editDialogFormVisible: false, //默认 编辑用户对话框 隐藏
      editForm: {
        //定义添加对话框表单，绑定对话框的具体内容
        username: "",
        email: "",
        mobile: "",
        id: 0
      },
      grantDialogFormVisible: false, //默认 分配角色对话框 隐藏
      grantForm: {},
      rolesList: [], //保存所有的 角色 信息
      roleId: 0, //定义一个 角色信息的 ID值
      loading: true //定义加载动画， 当请求完毕之后才关闭加载动画
    };
  },
  created() {
    this.initList();
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      //获取每页显示多少条，把值传给data中，再把值传给请求中
      this.pagesize = val;
      //在调用请求
      this.initList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      //获取当前点击的第几页
      this.pagenum = val;
      this.initList();
    },
    //根据 接口要求 初始化列表请求
    initList() {
      getUserList({
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(res => {
        this.loading = true;
        console.log(res);
        this.userList = res.data.users;
        this.total = res.data.total;
        this.loading = false;
      });
    },
    //监听 当前这个用户的所有数据，查看用户状态,在这个方法下面我们发送 改变用户状态的请求
    ChangeUserState(row) {
      console.log(row);
      console.log(row.mg_state);
      changeUserState({ uid: row.id, type: row.msg_state }).then(res => {
        console.log(res);
        //修改成功，我们就做一个消息提示框
        if (res.meta.status === 200) {
          if (row.mg_state) {
            this.$message({
              message: "用户状态已开启",
              type: "success"
            });
          } else {
            this.$message({
              message: "用户状态已关闭",
              type: "warning"
            });
          }
        } else {
          this.$message({
            message: "修改用户状态失败",
            type: "warning"
          });
        }
      });
    },
    //校验增加用户表单信息，并发送添加请求
    addUserSubmit(forName) {
      this.$refs[forName].validate(valid => {
        //只有校验通过，才能执行 发送请求
        if (valid) {
          addUser(this.addForm).then(res => {
            console.log(res);
            if (res.meta.status === 201) {
              this.$message({
                message: "已成功创建用户",
                type: "success"
              });
              this.addDialogFormVisible = false;
              this.initList();
            }
          });
        } else {
          this.$message({
            message: "添加用户失败",
            type: "warning"
          });
          return false;
        }
      });
    },
    //监听 当前这个用户的所有数据，查看用户ID,在这个方法下查询用户信息，把信息赋值给编辑框表单中
    showEdit(row) {
      console.log(row);
      getUserById({ id: row.id }).then(res => {
        console.log(res);
        this.editDialogFormVisible = true;
        if (res.meta.status === 200) {
          this.editForm.username = res.data.username;
          this.editForm.email = res.data.email;
          this.editForm.mobile = res.data.mobile;
          this.editForm.id = res.data.id;
        }
      });
    },
    //校验编辑用户表单信息，并发送编辑请求
    editUserSubmit(forName) {
      this.$refs[forName].validate(valid => {
        //只有校验通过，才能执行 发送 编辑请求
        if (valid) {
          editUser(this.editForm).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                message: "已成功编辑用户",
                type: "success"
              });
              this.editDialogFormVisible = false;
              this.initList();
            }
          });
        } else {
          this.$message({
            message: "编辑用户失败",
            type: "warning"
          });
          return false;
        }
      });
    },
    //监听当前这个用户的所有数据，查看用户ID,在这个方法下面我们发送 删除用户的请求
    showDelete(row) {
      console.log(row);
      //使用组件中的弹出框，来确认用户是否删除用户信息
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //在成功的回调中，我们发送删除请求
          deletetUser(row.id).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.initList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //监听角色分配当前数据ID，把用户信息渲染到表单中，并显示角色对话框，发送获取角色列表数据，渲染对话框
    showGrant(row) {
      console.log(row);
      this.grantForm = row;
      this.grantDialogFormVisible = true;
      rolesUser().then(res => {
        console.log(res);
        if (res.meta.status === 200) {
          this.rolesList = res.data;
        }
      });
    },
    //点击 确认分配按钮，发送分配请求
    grantUserSubmit() {
      //解决一个bug，当点开分配框，没有选择的时候，就要提示，选择，否则就不执行下面的请求操作。
      if (!this.roleId) {
        this.$message({
          type: "warning",
          message: "选择框不能为空"
        });
      } else {
        grantUser({ id: this.grantForm.id, rid: this.roleId }).then(res => {
          console.log(res);
          if (res.meta.status === 200) {
            this.$message({
              type: "success",
              message: "角色分配信息成功"
            });
            this.grantDialogFormVisible = false;
            this.initList();
          } else {
            this.$message({
              message: "编辑用户失败",
              type: "warning"
            });
            return false;
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.user {
  .margin-20{
      margin: 20px 0;
  }
  .search-input {
    width: 300px;
  }
  .page {
    padding: 5px 0;
    background-color: #d3dce6;
  }
}
</style>
