// 引入vue
import Vue from 'vue'

// 引入axios
import axios from 'axios'

// 引入elementui的组件 和 样式
import ElementUI from 'element-ui'; // 组件文件（js）
import 'element-ui/lib/theme-chalk/index.css'; // 样式文件

// 引入解构组件
import {Message} from 'element-ui';

// 引入顶级组件 App.vue
import App from './App.vue'
// 引入路由文件
import router from './router'

// 引入公用样式
import '@/styles/common.less';

// 注册（使用）elementui
Vue.use(ElementUI);

// 把axios挂在Vue的原型上，所有Vue共享
Vue.prototype.axios=axios;

// 全局路由守卫，拦截所有路由
router.beforeEach((to,from,next)=>{
  // 获取token
  const token=window.localStorage.getItem('token');
  // 判断
  if(token){
    // 有token，直接放行
    next();
  }else{
    // 无token，再次判断是否去的登录页面
    if(to.path==='/login'){
      // 是登录页面，放行
      next();
    }else{
      // 不是登录页面，则跳转到登录页，并弹出提示信息
      Message.warning('请先登录!')

      return next({"path":"/login"})
    }
  }
})


//  阻止生产提示
Vue.config.productionTip = false

// 创建vue实例对象 挂载dom 把路由 和 app顶级组件传入 渲染进入dom容器中
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
