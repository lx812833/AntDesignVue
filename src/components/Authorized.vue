<script>
import { check } from "../utils/auth";
export default {
  // 函数式权限校验组件
  functional: true,  //  functional 开关，设置为 true 后，就可以让组件变为无状态、无实例的函数化组件
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