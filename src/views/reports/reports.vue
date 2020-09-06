<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top: 15px;">
      <div style="width:1000px;height:600px" ref="chart"></div>
    </el-card>
  </div>
</template>
 
<script>
import { getData } from "@/network/get.js";
export default {
  name: "",
  data() {
    return {
		 options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
	  },
	};
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      // 基于准备好的dom，初始化echarts实例
	  let myChart = this.$echarts.init(this.$refs.chart);
	  getData().then(res=>{
		//   console.log(res)
		  const result = _.merge(res.data, this.options)

      myChart.setOption(result);
	  })

	
    }
  }
};
</script>
 
<style scoped>
</style>
