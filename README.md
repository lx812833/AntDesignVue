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