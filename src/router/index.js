import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  /* {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }, */
  {
    path: '/role/assign/users',
    component: Layout,
    redirct: '/role/assign/user/index',
    children: [{
      path: 'index',
      name: 'assignUsers',
      component: _import('role/assignUsers'),
      meta: {
        title: 'assignUsers',
        code: 'sys.role.edit'
      }
    }],
    hidden: true
  },
  {
    path: '/cms/article/add',
    component: Layout,
    redirct: '/cms/article/add/index',
    children: [{
      path: 'index',
      name: 'addArticle',
      component: _import('cms/article/editor'),
      meta: {
        title: 'addArticle',
        code: 'cms.article.add'
      }
    }],
    hidden: true
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/sys',
    component: Layout,
    redirect: 'noredirect',
    name: 'sysManagement',
    meta: {
      title: 'sysManagement',
      icon: 'sys'
    },
    children: [
      {
        path: 'user',
        component: _import('user/index'),
        name: 'userManagement',
        meta: { title: 'userManagement', icon: 'user', code: 'sys.user' }
      },
      {
        path: 'role',
        component: _import('role/index'),
        name: 'roleManagement',
        meta: { title: 'roleManagement', icon: 'role', code: 'sys.role' }
      },
      {
        path: 'unit',
        component: _import('unit/index'),
        name: 'unitManagement',
        meta: { title: 'unitManagement', icon: 'unit', code: 'sys.unit' }
      },
      {
        path: 'perm',
        component: _import('perm/index'),
        name: 'permManagement',
        meta: { title: 'permManagement', icon: 'perm', code: 'sys.user' }
      }
    ]
  },

  {
    path: '/cms',
    component: Layout,
    redirect: 'noredirect',
    name: 'cms',
    meta: {
      title: 'cms',
      icon: 'cms',
      code: 'cms'
    },
    children: [
      {
        path: 'article',
        component: _import('cms/article/index'),
        name: 'cmsArticleManagement',
        meta: { title: 'cmsArticleManagement', icon: 'article', code: 'cms.article' }
      },
      {
        path: 'type',
        component: _import('cms/article/index'),
        name: 'cmsArticleManagement',
        meta: { title: 'cmsArticleManagement', icon: 'article', code: 'cms.article' },
        hidden: true
      }
    ]
  },

  /* {
    path: '/icon',
    component: Layout,
    children: [{
      path: 'index',
      component: _import('svg-icons/index'),
      name: 'icons',
      meta: { title: 'icons', icon: 'icon', noCache: true }
    }]
  },*/

  { path: '*', redirect: '/404', hidden: true }
]
