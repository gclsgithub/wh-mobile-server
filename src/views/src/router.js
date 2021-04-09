import Vue from "vue";
import Router from "vue-router";
import NantongPage from './components/NantongPage';
import NantongLogin from './components/NantongLogin';
import NantongRegister from './components/NantongRegister';
import NantongForgetPwd from './components/NantongForgetPwd';
import NantongResetPwd from './components/NantongResetPwd';
import NantongHistory from './components/NantongHistory';
import MaintanceHistoryDetail from './components/MaintanceHistoryDetail';

Vue.use(Router);

const constantRouterMap = [
    {
      path: '/',
      name: 'login',
      component: NantongLogin,
      meta:{
        title:'登录'
      },
      hidden: true,
      children: [],
    },
    {
      path: '/maintance_page',
      name: 'maintance_page',
      component: NantongPage,
      meta:{
        title:'淮阴师范失物招领系统'
      },
      hidden: true,
      children: []
    },
    {
      path: '/regist_page',
      name: 'regist_page',
      component: NantongRegister,
      meta:{
        title:'注册'
      },
      hidden: true,
      children: []
    },
    {
      path: '/forget_pwd',
      name: 'forget_pwd',
      component: NantongForgetPwd,
      meta:{
        title:'忘记密码'
      },
      hidden: true,
      children: []
    },
    {
      path: '/reset_pwd',
      name: 'reset_pwd',
      component: NantongResetPwd,
      meta:{
        title:'重置密码'
      },
      hidden: true,
      children: []
    },
    {
      path: '/maintance_list',
      name: 'maintance_list',
      component: NantongHistory,
      meta:{
        title:'淮阴师范失物招领系统'
      },
      hidden: true,
      children: [],
      props: true
    },
    {
      path: '/maintance_history_detail',
      name: 'maintance_history_detail',
      component: MaintanceHistoryDetail,
      meta:{
        title:'淮阴师范失物招领系统'
      },
      hidden: true,
      children: [],
      props: true 
    },

    
]
export default new Router({
  mode: "history",
  routes: constantRouterMap
});