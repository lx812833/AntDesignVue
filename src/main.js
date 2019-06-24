import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";

import {
  Button,
  Layout,
  Icon,
  Drawer,
  Radio,
  Menu,
  Form,
  Input,
  Select,
  LocaleProvider,
  Dropdown,
  DatePicker
} from "ant-design-vue";

Vue.use(DatePicker)
  .use(Dropdown)
  .use(LocaleProvider)
  .use(Select)
  .use(Input)
  .use(Form)
  .use(Menu)
  .use(Radio)
  .use(Button)
  .use(Layout)
  .use(Icon)
  .use(Drawer);

// 定义全局权限校验组件
import Authorized from "./components/Authorized"
Vue.component("Authorized", Authorized)

// 使用指令进行权限校验
import Auth from "./directives/auth"
Vue.use(Auth)


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
