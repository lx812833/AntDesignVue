import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
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

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
