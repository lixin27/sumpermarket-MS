// 引入vue
import Vue from 'vue'
// 引入路由
import Router from 'vue-router'

// 注册路由(使用路由)
Vue.use(Router)

// 导出路由实例对象
export default new Router({
  routes: [
    {
      path: '/login',  // 路径
      name: 'login', // 名字
      component: () => import('./views/Login/Login.vue')  // 引入登录组件
    },
    {
      path: '/',  // 路径
      component: () => import('./views/Index/Index.vue'),  // 引入后端首页组件
      children: [
        {
          path: '',
          component: () => import('./views/Home/Home.vue')
        },
        {
          path: '/accountmanage',
          name: 'accountmanage',
          component: () => import('./views/AccountManage/AccountManage.vue')
        },
        {
          path: '/accountadd',
          name: 'accountadd',
          component: () => import('./views/AccountAdd/AccountAdd.vue')
        },
        {
          path: '/passwordmodify',
          name: 'passwordmodify',
          component: () => import('./views/PasswordModify/PasswordModify.vue')
        },
        {
          path: '/goodsmanage',
          name: 'goodsmanage',
          component: () => import('./views/GoodsManage/GoodsManage.vue')
        },
        {
          path: '/goodsadd',
          name: 'goodsadd',
          component: () => import('./views/GoodsAdd/GoodsAdd.vue')
        },
        {
          path: '/salestatistics',
          name: 'salestatistics',
          component: () => import('./views/SaleStatistics/SaleStatistics.vue')
        }
      ]
    }
  ]
})
