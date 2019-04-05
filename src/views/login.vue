<template>
  <div class="login">

    <el-form ref="form" :model="form" class="container" :rules="rules">
      <el-form-item>
        <div class="avatar">
          <img src="../assets/avatar.jpg" alt>
        </div>
      </el-form-item>
      <el-form-item prop="username">
        <el-input
          v-model="form.username"
          placeholder="账户"
          prefix-icon="myicon myicon-user"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          placeholder="密码"
          prefix-icon="myicon myicon-key"
          type="password"
          @keydown.native.enter="loginSubmit('form')"
        ></el-input>
      </el-form-item>
      <el-form-item >
      <el-button type="primary" class="login-btn" @click="loginSubmit('form')">登陆</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
//引入登陆请求
import { checkUser } from '@/app/axios.js'


export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" }
        ]
      }
    };
  },
  methods: {
     //组件中 提交表单验证的方法（发送请求）
     loginSubmit(forName) {
        this.$refs[forName].validate( (valid) => {
            //只有校验通过，才能执行 发送请求
            if(valid) {
                checkUser(this.form).then( res => {
                    console.log(res);
                    //成功的话就跳转home页面
                    if(res.meta.status === 200) {
                        //跳转之前，调用mutations方法 把用户名存在vuex中
                        this.$store.commit('SetUsername',res.data.username)
                        //使用JS编程式路由导航
                        this.$router.push({ name: "Home" }) 
                        //把token存放在本地存储中
                        localStorage.setItem('mytoken',res.data.token)
                    }
                    else{
                    //如果失败，利用组件中的提示失败信息
                      this.$message({
                      message: res.meta.msg,
                      type: 'error'
                      });    
                    }
                })
            }
            else {
                this.$message({
                      message: '草泥马，你不输入账号密码，你确认你妈？',
                      type: 'warning'
                      });  
                return false
            }
        })
     }
  }
};
</script>

<style lang="scss" scoped>
.login {
  //postion:fixed 绝对定位，相对于浏览器窗口进行定位布局。
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;

  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    background: white;
    padding: 0px 40px 15px 40px;
    .avatar {
      //relative 相对定位，不脱标，但会占位置。
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      transform: translateX(-50%);
      border: 10px solid #fff;
      margin-top: -60px;
      border-radius: 50%;
      //border-box 会把盒子的内容 + padding + 边框 都算做盒子的大小
      box-sizing: border-box;
      overflow: hidden;
      box-shadow: 0 1px 5px #ccc;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>