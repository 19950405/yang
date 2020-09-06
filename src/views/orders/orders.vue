<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top: 15px;">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="orderInfo.query" clearable @click="getOrder">
            <el-button slot="append" icon="el-icon-search" @click="getOrder"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderList" style="width: 100%;margin-top:20px" border>
        <el-table-column type="index" label="#" width="80"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="280"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货">
          <!-- <template slot-scope="scope">{{scope.row.is_send}}</template> -->
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">{{ formatDate(scope.row.create_time) }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 修改按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="EditDialog"></el-button>
          <!-- 删除按钮 -->
          <el-button type="success" icon="el-icon-location" size="mini" @click="Adress"></el-button>
        </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="orderInfo.pagenum"
          :page-sizes="[10,20,30]"
          :page-size="orderInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top: 27px;"
        ></el-pagination>
      </div>
    </el-card>
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="one">
          <el-cascader :options="cityData" v-model="addressForm.one"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="two">
          <el-input v-model="addressForm.two"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in logisticsList"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
 
<script>
import { getOrder, getlogistics } from "@/network/get.js";
import cityData from "./citydata.js";
export default {
  name: "",
  data() {
    return {
      orderList: [],
      orderInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
        user_id: 0
      },
      addressForm: {
        one: [],
        two: ""
      },
      addressFormRules: {
        one: [{ required: true, message: "请选择省市区县", trigger: "blur" }],
        two: [{ required: true, message: "请填写详细地址", trigger: "blur" }]
      },
      total: 0,
      cityData,
      addressVisible: false,
      progressVisible: false,
      logisticsList: []
    };
  },
  created() {
    this.getOrder();
  },
  methods: {
    getOrder() {
      getOrder(this.orderInfo).then(res => {
        // console.log(res);
        this.orderList = res.data.goods;
        this.total = res.data.total;
      });
    },
    EditDialog() {
      this.addressVisible = true;
    },
    Adress() {
      this.progressVisible = true;
      getlogistics().then(res => {
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("获取物流进度失败！");
        }
        this.logisticsList = res.data;
      });
    },
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.orderInfo.pagesize = newSize;
      this.getOrder();
    },
    handleCurrentChange(newPage) {
      //   console.log(newPage);
      this.orderInfo.pagenum = newPage;
      this.getOrder();
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
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
    }
  }
};
</script>
 
<style scoped>
</style>
