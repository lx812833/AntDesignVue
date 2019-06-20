import Vue from "vue";
import Router from "vue-router";
import findLast from "lodash/findLast";
// Lodash 通过降低 array、number、objects、string 等等的使用难度从而让 JavaScript 变得更简单。
// 是JavaScript实用工具库
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import NotFound from "./views/404";
import Forbidden from "./views/403"
import { check, isLogin } from "./utils/auth"
import { notification } from "ant-design-vue";


Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/user",
      // component: { render: h => h("router-view") },  使用render函数加载router-view
      hideInMenu: true, // 添加标志位，在侧边菜单栏渲染时过滤掉
      component: () => import(/* webpackChunkName: "layout" */ "./Layouts/UserLayout.vue"),
      children: [
        {
          path: "/user",
          redirect: "/user/login" // 路由重定向
        },
        {
          path: "/user/login",
          name: "login",
          component: () => import(/* webpackChunkName: "user" */ "./views/User/Login.vue")
        },
        {
          path: "/user/register",
          name: "register",
          component: () => import(/* webpackChunkName: "user" */ "./views/User/Register.vue")
        }
      ]
    },
    {
      path: "/",
      meta: { authority: ["user", "admin"] },  // 设置访问权限
      component: () => import(/* webpackChunkName: "layout" */ "./Layouts/BasicLayout.vue"),
      children: [
        // dashboard 仪表盘
        {
          path: "/",
          redirect: "/dashboard/analysis"
        },
        {
          path: "/dashboard",
          name: "dashboard",
          meta: { icon: "dashboard", title: "仪表盘" }, // 设置图标与名称
          component: { render: h => h("router-view") },
          children: [
            {
              path: "/dashboard/analysis",
              name: "analysis",
              meta: { title: "分析页" },
              component: () => import(/* webpackChunkName: "dashboard" */ "./views/Dashboard/Analysis")
            }
          ]
        },
        // form 报文
        {
          path: "/form",
          name: "form",
          component: { render: h => h("router-view") },
          meta: { icon: "form", title: "表单", authority: ["admin"] },
          children: [
            {
              path: "/form/basic-form",
              name: "basicform",
              meta: { title: "基础表单" },
              component: () => import(/* webpackChunkName: "form" */ "./views/Forms/BasicForm")
            },
            {
              path: "/form/step-form",
              name: "stepform",
              hideChildInMenu: true,
              meta: { title: "分布表单" },
              component: () => import(/* webpackChunkName: "form" */ "./views/Forms/StepForm"),
              children: [
                {
                  path: "/form/step-form",
                  redirect: "/form/step-form/info"
                },
                {
                  path: "/form/step-form/info",
                  name: "info",
                  component: () => import(/* webpackChunkName: "form" */ "./views/Forms/StepForm/Step1")
                },
                {
                  path: "/form/step-form/confirm",
                  name: "confirm",
                  component: () => import(/* webpackChunkName: "form" */ "./views/Forms/StepForm/Step2")
                },
                {
                  path: "/form/step-form/result",
                  name: "result",
                  component: () => import(/* webpackChunkName: "form" */ "./views/Forms/StepForm/Step3")
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: "/403",
      name: "403",
      hideInMenu: true,
      component: Forbidden
    },
    {
      path: "*",
      name: "404",
      hideInMenu: true,
      component: NotFound
    }
  ]
});

// 在路由守卫中判断路由是否有权限

router.beforeEach((to, from, next) => {
  // 当切换主题时不进行显示
  if (to.path != from.path) {
    NProgress.start();
  }
  // 在路由守卫中对访问权限进行判断
  const record = findLast(to.matched, record => record.meta.authority)
  console.log(record)
  if (record && !check(record.meta.authority)) {  // 判断是否有登录权限
    if (!isLogin() && to.path !== "/user/login") {
      next({
        path: "user/login"
      })
    } else if (to.path !== "/403") {
      notification.error({
        message: '403',
        description: '您没有访问权限，请联系管理员',
      });
      next({
        path: "/403"
      })
    }
    NProgress.done()
  }
  next();
})

router.afterEach(() => {
  NProgress.done();
})

export default router