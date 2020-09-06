<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card style="margin-top:15px">
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" style="margin-top:30px">
        <el-form-item label="选择商品分类">
          <div class="block">
            <el-cascader
              expand-trigger="hover"
              :options="cateList"
              :props="cateData"
              v-model="selectedCateKeys"
              @change="getParams"
            ></el-cascader>
          </div>
        </el-form-item>
        <el-form-item></el-form-item>
      </el-form>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="small"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加参数</el-button>
          <el-table :data="manyList" border stripe style="margin-top:30px">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  style="margin-right:4px"
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="small" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
          <el-table :data="onlyList" border stripe style="margin-top:30px">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  style="margin-right:4px"
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 添加参数的对话框 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 添加参数的对话框 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCate,
  manyTableData,
  SaveAtrr,
  removeParams,
  AddParams,
  EditParams,
  ToEditParams
} from "@/network/get.js";
export default {
  data() {
    return {
      cateData: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      cateList: [],
      form: {
        goods_name: "",
        goods_price: "0",
        goods_weight: "0",
        goods_number: "0",
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: "",
        attrs: []
      },
      // 动态参数的数据
      manyList: [],
      // 静态属性的数据
      onlyList: [],
      selectedCateKeys: [],
      activeName: "many",
      formInline: {
        user: "",
        region: ""
      },
      addDialogVisible: false,
      addForm: {
        attr_name: ""
      },
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      }
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
        // console.log(this.cateList)
      });
    },
    // 添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        AddParams(this.cateId, this.addForm.attr_name, this.activeName).then(
          res => {
            console.log(res);
            this.getParams();
            this.addDialogVisible = false;
          }
        );
      });
    },
    showEditDialog(attrId) {
      // 查询当前参数的信息
      EditParams(this.cateId, attrId, this.activeName).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("获取参数信息失败！");
        }
         this.editForm = res.data
      });
      this.editDialogVisible = true;
    },
    editParams(){
        this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        ToEditParams(this.cateId,this.editForm.attr_id,this.editForm.attr_name,this.activeName).then(res=>{
          // console.log(res)
          if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败！')
        }

        this.$message.success('修改参数成功！')
        this.getParams()
        this.editDialogVisible = false
        })
        
      })
    },
    handleTabClick() {
      // console.log(this.activeName);
      this.getParams();
    },
    getParams() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyList = [];
        this.onlyList = [];
        return;
      }
      // console.log(this.activeName);
      manyTableData(this.cateId, this.activeName).then(res => {
        // console.log(this.activeName);

        if (res.meta.status !== 200) {
          return this.$message.error("获取参数列表失败！");
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          // 控制文本框的显示与隐藏
          item.inputVisible = false;
          // 文本框中输入的值
          item.inputValue = "";
          // console.log(this.onlyList)
        });
        // console.log(res.data);
        if (this.activeName === "many") {
          this.manyList = res.data;
        } else if (this.activeName === "only") {
          // console.log(1);
          this.onlyList = res.data;
        }
      });
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      // 如果没有return，则证明输入的内容，需要做后续处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      // 需要发起请求，保存这次操作
      this.saveAttrVals(row);
    },
    // 保存操作
    saveAttrVals(row) {
      let vals = row.attr_vals.join(" ");
      // console.log(this.activeName, vals);
      SaveAtrr(this.cateId, row.attr_id, row, this.activeName, vals).then(
        res => {
          // console.log(res);
        }
      );
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    },
    showInput(row) {
      // console.log(row);
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
      
    },
    // 删除对应参数
    removeParams(id) {
      console.log(id);
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
          removeParams(this.cateId, id).then(res => {
            // console.log(res);
            if (res.meta.status !== 200) {
              return this.$message.error("删除用户失败！");
            }

            this.$message.success("删除用户成功！");
            this.getParams();
          });
        })
        .catch(err => {
          console.log(err);
          return this.$message.info("已取消删除");
        });
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
      editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
  },

  computed: {
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 当前选中的三级分类的Id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    }
  }
};
</script>