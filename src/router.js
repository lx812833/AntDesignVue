import Vue from "vue";
import Router from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import NotFound from "./views/404";


Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/user",
      // component: { render: h => h("router-view") },  使用render函数加载router-view
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
          component: { render: h => h("router-view") },
          children: [
            {
              path: "/dashboard/analysis",
              name: "analysis",
              component: () => import(/* webpackChunkName: "dashboard" */ "./views/Dashboard/Analysis")
            }
          ]
        },
        // form 报文
        {
          path: "/form",
          name: "form",
          component: { render: h => h("router-view") },
          children: [
            {
              path: "/form/basic-form",
              name: "basicform",
              component: () => import(/* webpackChunkName: "form" */ "./views/Forms/BasicForm")
            },
            {
              path: "/form/step-form",
              name: "stepform",
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
      path: "*",
      name: "404",
      component: NotFound
    }
  ]
});

router.beforeEach((to, from, next) => {
  // ${//to and from are Route Object,next() must be called to resolve the hook}
  // 当切换主题时不进行显示
  if (to.path != from.path) {
    NProgress.start();
  }
  next();
})

router.afterEach(() => {
  // ${//these hooks do not get a next function and cannot affect the navigation}
  NProgress.done();
})

export default router