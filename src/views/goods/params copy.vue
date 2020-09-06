<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top: 15px;">
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning"></el-alert>
      <div class="demo-input-suffix" style="margin-top: 15px;">
        选择商品分类:
        <el-cascader v-model="selectedCateKeys" expand-trigger="hover" :options="cateList" :props="cateData"></el-cascader>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick" :data="manyList">
        <el-tab-pane label="动态参数" name="first">
          <el-button type="primary" disabled>添加参数</el-button>
          <el-table style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-col :span="18">
                  <el-tag
                    type="warning"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    closable
                    @close="removeRightById(props.row, item3.id)"
                    style="margin-right:15px;margin:10px"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index" width="80"></el-table-column>
            <el-table-column label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="second">配置管理</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
 
<script>
import { getCate, manyTableData, onlyTableData } from "@/network/get.js";
export default {
  name: "",
  data() {
    return {
      cateList: [],
      cateData: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
	  activeName: "second",
	  selectedCateKeys: [],
	  manyList:[],
	  onlyList:[],
    };
  },
  created() {
    this.getCate();
  },
  methods: {
    getCate() {
      getCate().then(res => {
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("获取商品分类数据失败！");
        }
        this.cateList = res.data;
      });
    },
    handleClick(tab) {
        // console.log(this.cateId);
      if (tab.label == "动态参数") {
        manyTableData(this.cateId).then(res => {
		  console.log(res);
		  this.manyList=res.data
		  console.log(this.manyList)
        });
      } else if (tab.label == "静态属性") {
        onlyTableData(this.cateId).then(res => {
		//   console.log(res);
		  this.manyList=res.data
        });
	  }
	  
    }
  },
  computed: {
    cateId() {
		// console.log(this.selectedCateKeys)
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    }
  }
};
</script>
 
<style scoped>
</style>
