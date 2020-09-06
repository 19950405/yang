<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top: 15px;">
      <el-row :gutter="20">
        <el-col :span="2">
          <el-button type="primary" @click="goAdd">添加商品</el-button>
        </el-col>
      </el-row>
      
       <el-table
        :data="CateList"
        style="width: 100%;margin-bottom: 20px;"
        row-key="cat_id"
        border
        :default-expand-all='false'
        :tree-props="{children: 'children', label: 'cat_name'}"
      >
        <el-table-column label="#" type="index" width="50"></el-table-column>
        <el-table-column label="分类名称" prop="cat_name" width="400">
        </el-table-column>
        <el-table-column label="是否有效" prop="cat_deleted" width="400">
          <template slot-scope="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.cat_deleted === false"
              style="color: lightgreen;"
            ></i>
            <i class="el-icon-error" v-else style="color: red;"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="cat_level" width="400">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- <el-table
    :data="CateList"
    style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="商品名称">
            <span>{{ props.row.cat_name }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="商品 ID"
      prop="id">
    </el-table-column>
    <el-table-column
      label="商品名称"
      prop="name">
    </el-table-column>
    <el-table-column
      label="描述"
      prop="desc">
    </el-table-column>
      </el-table>-->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="cateInfo.pagenum"
          :page-sizes="[10,20,30]"
          :page-size="cateInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top: 27px;"
        ></el-pagination>
      </div>
    </el-card>

    <el-dialog title="添加分类" :visible.sync="Catvisiable" width="50%">
      <!-- 添加分类的表单 -->
      <el-form label-width="100px">
        <el-form-item label="分类名称：">
          <el-input v-model="catForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            expand-trigger="hover"
            :props="cascaderProps"
            @change="change"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Catvisiable = false">取 消</el-button>
        <el-button type="primary" @click="Catvisiable = false;sure()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
 
<script>
import { getCateData, AddCate, getCateParent } from "@/network/get.js";
export default {
  name: "",
  data() {
    return {
      CateList: [],
      cateInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      defaultProps: {
        children: "children",
        label: "cat_name"
      },
      Catvisiable: false,
      selectedKeys: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      catForm: {
        // 将要添加的分类的名称
        cat_name: "",
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      parentCateList: []
    };
  },
  created() {
    this.getCate();
    this.getCateParent();
  },
  methods: {
    get(i) {
      console.log(i);
    },
    getCate() {
      getCateData(this.cateInfo).then(res => {
        // console.log(res);
        this.CateList = res.data.result;
        this.total = res.data.total;
      });
    },
    getCateParent() {
      getCateParent().then(res => {
        console.log(res);
        this.parentCateList = res.data;
      });
    },
    goAdd() {
      this.Catvisiable = true;
    },
    change() {
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.catForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        // 为当前分类的等级赋值
        this.catForm.cat_level = this.selectedKeys.length;
      } else {
        // 父级分类的Id
        this.catForm.cat_pid = 0;
        // 为当前分类的等级赋值
        this.catForm.cat_level = 0;
      }
    },
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.cateInfo.pagesize = newSize;
      this.getCate();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      //   console.log(newPage);
      this.cateInfo.pagenum = newPage;
      this.getCate();
    },
    sure() {
      AddCate(this.catForm).then(res => {
        console.log(res);
      });
    },
    handleNodeClick(data) {
      console.log(data);
    }
  }
};
</script>
 
<style scoped>
</style>