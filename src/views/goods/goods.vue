<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-top: 15px;">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="userInfo.query" clearable @click="getGoods">
            <el-button slot="append" icon="el-icon-search" @click="getGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="goAdd">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table :data="goodsList" style="width: 100%">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="1000"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="150"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="scope">{{ formatDate(scope.row.add_time) }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUser(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="userInfo.pagenum"
          :page-sizes="[10,20,30]"
          :page-size="userInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top: 27px;"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getGoods, DeleGoods } from "@/network/get.js";
export default {
  data() {
    return {
      userInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0
    };
  },
  created() {
    this.getGoods();
  },
  methods: {
    getGoods() {
      getGoods(this.userInfo).then(res => {
        // console.log(res);
        this.goodsList = res.data.goods;
        this.total = res.data.total;
      });
    },
    removeUser(id) {
    //   console.log(id);
      // 弹框询问用户是否删除数据
      const confirmResult = this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(resa => {
          DeleGoods(id).then(res => {
            console.log(res);
            if (res.meta.status !== 200) {
              return this.$message.error("删除用户失败！");
            }

            this.$message.success("删除用户成功！");
            this.getGoods();
          });
        })
        .catch(err => {
          return this.$message.info("已取消删除");
        });
	},
	goAdd(){
		this.$router.push('/goods/add')
	},
    formatDate(row) {
      var date = new Date(row);
      let Y = date.getFullYear() + "-";
      let M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1) + "-"
          : date.getMonth() + 1 + "-";
      let D =
        date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
      let h =
        date.getHours() < 10
          ? "0" + date.getHours() + ":"
          : date.getHours() + ":";
      let m =
        date.getMinutes() < 10
          ? "0" + date.getMinutes() + ":"
          : date.getMinutes() + ":";
      let s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.userInfo.pagesize = newSize;
      this.getGoods();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      //   console.log(newPage);
      this.userInfo.pagenum = newPage;
      this.getGoods();
    }
  }
};
</script>

<style scoped>
.el-table td,
.el-table th {
  padding: 20px 0;
  min-width: 0;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
}
</style>
