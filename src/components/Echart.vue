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
    //   handler(val) {
    //     this.echart.setOption(val);
    //   },
    //   deep: true
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
