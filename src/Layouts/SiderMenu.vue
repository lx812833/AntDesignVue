<template>
  <div style="width: 256px">
    <a-menu
      :defaultSelectedKeys="['1']"
      :defaultOpenKeys="['2']"
      mode="inline"
      :theme="theme"
      :inlineCollapsed="collapsed"
    >
      <template v-for="item in list">
        <a-menu-item
          v-if="!item.children"
          :key="item.key"
        >
          <a-icon type="pie-chart" />
          <span>{{item.title}}</span>
        </a-menu-item>
        <sub-menu
          v-else
          :menu-info="item"
          :key="item.key"
        />
      </template>
    </a-menu>
  </div>
</template>

<script>
/*
 * recommend SubMenu.vue https://github.com/vueComponent/ant-design-vue/blob/master/components/menu/demo/SubMenu.vue
 * SubMenu1.vue https://github.com/vueComponent/ant-design-vue/blob/master/components/menu/demo/SubMenu1.vue
 * */
import SubMenu from "./SubMenu";
export default {
  props: {
    theme: {
      type: String,
      default: "dark"
    }
  },
  components: {
    "sub-menu": SubMenu
  },
  // 将路由的数据生成一个菜单
  data() {
    const menuData = this.getMenuData(this.$router.options.routes);
    // $router.options.routes 获取路由配置信息
    return {
      collapsed: false,
      list: [
        {
          key: "1",
          title: "Option 1"
        },
        {
          key: "2",
          title: "Navigation 2",
          children: [
            {
              key: "2.1",
              title: "Navigation 3",
              children: [{ key: "2.1.1", title: "Option 2.1.1" }]
            }
          ]
        }
      ],
      menuData
    };
  },
  methods: {
    getMenuData(routes) {
      //  console.log(route);
      const menuData = [];
      routes.forEach(item => {
        if (item.name && !item.hideInMenu) {
          const newItem = { ...item };
          delete newItem.children;
          if (item.children && !item.hideChildInMenu) {
            newItem.children = this.getMenuData(item.children);
          }
          menuData.push(newItem);
        } else if (!item.hideInMenu && !item.hideChildInMenu && item.children) {
          menuData.push(...this.getMenuData(item.children));
        }
      });
      console.log(menuData);
      return menuData;
    }
  }
};
</script>
