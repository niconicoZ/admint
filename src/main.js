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

//2.引入通用样式文件
import '@/style/index.scss'

Vue.config.productionTip = false

//实例化Vue
new Vue({
  //指定根组件中的 控制区域
  el: '#app',
  //挂载路由
  router,
  //挂载根组件
  components: { App },
  template: '<App/>'
})
