## Ant Design Vue

好记性不如烂笔头，这里是记录学习`Ant Design Vue` 的学习笔记。

### Vue

#### 路由

##### 导航守卫

“导航”表示路由正在发生变化，**vue-router**提供的导航守卫主要用来通过跳转或取消的方式守卫导航。但是 **参数或查询的改变并不会触发进入/离开的导航守卫** 。可以通过观察 `$route 对象`来应对这些变化，或使用 `beforeRouteUpdate` 的组件内守卫。

###### 全局前置守卫

可以使用 **`router.beforeEach`** 注册一个**全局前置守卫：**

```python
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```

当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 `resolve` 完之前一直处于 等待中。
每个守卫方法接收三个参数：

* **to: Route:** 即将要进入的目标 路由对象
* **from: Route:** 当前导航正要离开的路由
* **next: Function:** 一定要调用该方法来 **resolve** 这个钩子。执行效果依赖 **next** 方法的调用参数。
    * **next():** 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 `confirmed` (确认的)
    * **next(false):** 中断当前的导航。如果浏览器的 `URL` 改变了 (可能是用户手动或者浏览器后退按钮)，那么 `URL` 地址会重置到 `from` 路由对应的地址。
    * **next('/') 或者 next({ path: '/' }):** 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。可以向 `next` 传递任意位置对象，且允许设置诸如 `replace: true、name: 'home'` 之类的选项以及任何用在 `router-link` 的 `to prop` 或 `router.push` 中的选项。
    * **next(error): (2.4.0+)** 如果传入 `next` 的参数是一个 `Error` 实例，则导航会被终止且该错误会被传递给 `router.onError()` 注册过的回调。确保要调用 `next` 方法，否则钩子就不会被 `resolved`。

其中，例如，**`to`** 有很多属性
- fullpath
- hash
- matched
- meta
- name
- params
- path
- query

###### 全局后置钩子

也可以注册**全局后置钩子**，然而和守卫不同的是，这些钩子不会接受 `next` 函数也不会改变导航本身：

```python
router.afterEach((to, from) => {
  // ...
})
```
具体看官网

##### 路由元信息

定义路由的时候可以配置 **meta** 字段：

```python
const router = new VueRouter({
routes: [
  {
    path: '/foo',
    component: Foo,
    children: [
      {
        path: 'bar',
        component: Bar,
        // a meta field
        meta: {
          icon: "dashboard",   // 定义图标
          title: "仪表盘",     // 定义标题
          requiresAuth: true   // 需要进行权限验证
        }
      }
    ]
  },
  ......
]})
```
在**路由配置**的时候，给每个路由添加一个自定义的**meta**对象，在**meta**对象中可以设置一些状态，来进行一些操作。用它来做登录校验再合适不过了

```python
router.beforeEach((to, from, next) => {
  if (to.matched.some(item =>  {
    return item.meta.requiresAuth
  })) {
    next('/login')
  } else 
    next()
})


export default router
```

**`$router.options.routes`** 获取路由配置信息
**`$route.matched`** 返回当前路由匹配到的组件类

#### 权限校验

权限校验是一个中后台十分重要的功能，根据权限来渲染左侧导航栏或者其他页面。

##### 使用路由进行权限校验

1. 建立`utils`文件夹，创建`auth.js`
    
    ```python    
    // 权限校验
    export function getCurrentAuthority() {
      return ['admin'] // 设置用户权限，以后会根据接口来获取权限
    }
    
    export function check(authority) {
      const current = getCurrentAuthority()
      return current.some(item => authority.includes(item)) // 权限存在返回true
    }
    
    // 判断登录权限
    export function isLogin() {
      const current = getCurrentAuthority()
      return current && current[0] != 'guest'
    }
    ```
2. 在`router.js`路由守卫中对访问权限进行判断，并且在 `routes`中设置`meta`来设置访问权限

    ```python
    meta: { icon: "form", title: "表单", authority: ["admin"] },
    ```
    
    ```python
    router.beforeEach((to, from, next) => {
      // 当切换主题时不进行显示
      if (to.path != from.path) {
          NProgress.start();
      }
        
      // 在路由守卫中对访问权限进行判断
      const record = findLast(to.matched, record => record.meta.authority)
      console.log(record)
      if (record && !check(record.meta.authority)) { // 判断是否有登录权限
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
    ```

3. 在`Layouts/SiderMenu.vue` 中进行渲染处理

##### 使用函数式组件进行权限校验

对于页面右侧设置按钮，则可利用另一种权限校验方法来进行设置。

1. 创建`components/Authorized.vue`,创建函数式权限校验组件
    
    ```python
    <script>
    import { check } from "../utils/auth";
    export default {
      // 函数式权限校验组件
      functional: true,
      // functional 开关，设置为 true 后，就可以让组件变为无状态、无实例的函数化组件
      props: {
        authority: {
          type: Array,
          required: true
        }
      },
      render(h, context) {
        const { props, scopedSlots } = context;
        return check(props.authority) ? scopedSlots.default() : null;
      }
    };
    </script>
    ```
2. 在 `main.js` 中将 `Authorized` 设置为全局权限校验组件
    
    ```python
    import Authorized from "./components/Authorized"
    Vue.component("Authorized", Authorized)
    // 定义全局权限校验组件
    ```
3. 在`Layouts/BasicLayout.vue`中进行设置权限
    
    ```python
    <Authorized :authority = "['admin']">
      <SettingDrawer />
    </Authorized>
    ```

##### 使用指令进行权限校验

1. 创建`directives/auth.js` 
    
    ```python
    // 利用指令来进行权限校验
    import { check } from "../utils/auth"
    function install(Vue, options = {}) {
      Vue.directive(options.name || "auth", {
        inserted(el, binding) {
          if (!check(binding.value)) {
            el.parentNode && el.parentNode.removeChild(el)
          }
        }
      })
    }
    export default { install }
    ```
2. 在 `main.js` 中将 `Auth` 设置为全局权限校验指令
    
    ```python
    // 使用指令进行权限校验
    import Auth from "./directives/auth"
    Vue.use(Auth)
    ```
 3. 在`Layouts/BasicLayout.vue`中进行设置权限
    
    ```python
    <a-icon  v-auth="['admin']" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="collapsed = !collapsed" ></a-icon>
    ```

同时还需在`data`中定义：


filedA: "",
filedAStatus: "",
filedAHelp: ""
```
使用`watch`监听器监听`filedA`变化

```python
watch: {
    filedA(val) {
        if (val.length <= 5) {
            this.filedAStatus = "error";
            this.filedAHelp = "必须大于5个字符";
        } else {
            this.filedAStatus = "";
            this.filedAHelp = "";
        }
    }
},
```
#### 使用阿里`IconFont`定义图标

百度搜索`IconFont`， 将选择好的图标加入项目中，选择生成外部链接。最后在 **`main.js`** 定义为全局组件。

```python
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_638417_xpkeyfypy5.js"
})

Vue.component("IconFont", IconFont)
```
最后在页面组件中使用，注意其 **`type`** 为所选图标icon

```python
<IconFont type="icon-404" />
```

#### `Echart`组件

封装了`Echart`组件，可以完成大部分图标业务。

```python
<template>
  <div ref="chartDOM"></div>
</template>

<script>
import echarts from "echarts";
import { addListener, removeListener } from "resize-detector";
import debounce from "lodash/debounce";
export default {
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    option(val) {
      this.echart.setOption(val);
    }
    // 深度监听option
    // option: {
    // handler(val) {
    // this.echart.setOption(val);
    // },
    // deep: true
    // }
  },
  created() {
    this.resize = debounce(this.resize, 300); // 防抖处理
  },
  mounted() {
    this.renderChart();
    addListener(this.$refs.chartDOM, this.resize); // 监听echart加载
  },
  methods: {
    resize() {
      this.echart.resize();
    },
    renderChart() {
      this.echart = echarts.init(this.$refs.chartDOM);
      this.echart.setOption(this.option);
    }
  },
  beforeDestroy() {
    removeListener(this.$refs.chartDOM, this.resize);
    // 销毁echart实例，防止内存泄露
    this.echart.dispose();
    this.echart = null;
  }
};
</script>
```

### 插件

#### Nprogress

进度条库是前端中常见的库之一。而 [Nprogress.js](https://github.com/rstacruz/nprogress)npm 就是一款轻量级的进度条组件，使用简便，用于页面刚打开时的页面加载进度显示。

```python
install --save nprogress
```
其基本语法只需调用`start()` 和 `done()`来控制进度条

```python
NProgress.start();
NProgress.done();
```
> 在路由中使用 **Nprogress**

在**路由**中使用 **Nprogress**，需要配合**路由守卫** 一起使用

```python
const router = new Router({
  base: process.env.BASE_URL,
  routes: [
    .....
  ]
})

router.beforeEach((to, from, next) => {
  // 当切换主题时不进行显示
  if (to.path != from.path) {
      NProgress.start();
  }
  next();
})

router.afterEach(() => {
  NProgress.done();
})

export default router
```