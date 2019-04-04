//引入Vue框架
import Vue from 'vue'
//引入根组件 App.vue
import App from './App'
//引入封装好的路由文件 -- index.js
import router from './router'

//1.引入elment-ui,并注册
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//2.引入通用样式文件 + icon图标
import '@/styles/index.scss'
Vue.config.productionTip = false

//注册一个全局守卫，作用是在路由跳转之前的一个路由周期函数对路由进行判断，
//防止未登陆的的用户跳转到其他需要登陆的页面
router.beforeEach( (to,from,next) => {
   //尝试从本地储存取出token
   let token = localStorage.getItem('mytoken')
   //判断是否有token，如果有就让他想进的的页面
   if(token) {
     next()
   }else { 
     //如果没有token，就让他跳转到登陆页面
     if(to.path !== '/login'){
        next({path:'/login'})
     }else {
       //如果他本身要去的login，就让直接让他去
       next()
     }
   }
})

//引入vuex 文件
import store from '@/store/store.js'


//实例化Vue
new Vue({
  //指定根组件中的 控制区域
  el: '#app',
  //挂载路由
  router,
  //挂载vuex
  store,
  //挂载根组件
  components: { App },
  template: '<App/>'
})
