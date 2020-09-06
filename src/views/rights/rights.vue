<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-top: 15px;">
      <el-table :data="getRoleData" style="width: 100%">
        <el-table-column label="#" type="index" width="80"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRights } from "@/network/get.js";
export default {
  data() {
    return {
      getRoleData: []
    };
  },
  created() {
    this.getRights();
  },
  methods: {
    getRights() {
      getRights().then(res => {
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("获取权限列表失败！");
        }
        this.getRoleData = res.data;
        console.log(this.getRoleData);
      });
    }
  }
};
</script>

<style>
</style>
