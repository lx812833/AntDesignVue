<template>
  <div>
    <Echart
      :option="chartOption"
      style="height: 400px"
    />
  </div>
</template>

<script>
import random from "lodash/random";
import Echart from "../../components/Echart";
import axios from "axios";
export default {
  components: {
    Echart
  },
  data() {
    return {
      chartOption: {}
    };
  },
  mounted() {
    this.getChartData();
    this.interval = setInterval(() => {
      //   this.chartOption.series[0].data = this.chartOption.series[0].data.map(
      //     () => random(100)
      //   );
      //   this.chartOption = { ...this.chartOption };
      this.getChartData();
    }, 60000);
  },
  methods: {
    getChartData() {
      axios.get("/api/dashboard/chart", { params: { ID: 12345 } }).then(res => {
        this.chartOption = {
          title: {
            text: "ECharts 入门示例"
          },
          tooltip: {},
          xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
          },
          yAxis: {},
          series: [
            {
              name: "销量",
              type: "bar",
              data: res.data
            }
          ]
        };
      });
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>