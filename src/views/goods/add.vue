<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top: 15px;">
      <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
      <el-steps
        :space="200"
        :active="activeIndex-0"
        finish-status="success"
        style="margin-top:15px"
        align-center
      >
        <el-step title="基本参数"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-tabs
        :tab-position="tabPosition"
        style="height: auto;margin-top:20px"
        :before-leave="beforeTabLeave"
        v-model="activeIndex"
        @tab-click="tabsClick"
      >
        <el-tab-pane label="基本信息">
          <el-form :model="goodsInfo" :rules="goodsFormRules" ref="addFormRef" label-width="101px">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsInfo.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="goods_price">
              <el-input type="number" v-model="goodsInfo.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="重量" prop="goods_weight">
              <el-input type="number" v-model="goodsInfo.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="goods_number">
              <el-input type="number" v-model="goodsInfo.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                :options="cateList"
                :props="cateData"
                @change="handleChange"
                v-model="goodsInfo.goods_cat"
              ></el-cascader>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品参数">
          <el-form>
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品属性">
          <el-form>
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品图片">
          <el-upload
            class="upload-demo"
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            list-type="picture"
            :headers="headerObj"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容">
          <quill-editor
            ref="text"
            style="height:200px"
            v-model="goodsInfo.goods_introduce"
            class="myQuillEditor"
          />
          <el-button type="primary" style="margin-top:80px" @click="submit">添加用户</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt class="Imgs" />
    </el-dialog>
  </div>
</template>
 
<script>
import { quillEditor } from "vue-quill-editor";
// import _ from 'lodash'
import {
  getCate,
  manyTableData,
  onlyTableData,
  Addgoods
} from "@/network/get.js";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  data() {
    return {
      activeIndex: "0",
      tabPosition: "left",
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      ImgsPath: "",
      previewPath: "",
      previewVisible: false,
      goodsInfo: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: []
      },
      goodsFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" }
        ]
      },
      cateList: [],
      cateData: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      headerObj: {
        Authorization: window.sessionStorage.getItem("userToken")
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: []
    };
  },
  components: {
    quillEditor
  },
  created() {
    this.getCate();
    // console.log(this.headerObj)
  },
  methods: {
    //   获取分类数据
    getCate() {
      getCate().then(res => {
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("获取商品分类数据失败！");
        }
        this.cateList = res.data;
      });
    },
    submit() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项！");
        }
        const form = this._.cloneDeep(this.goodsInfo);
        form.goods_cat = form.goods_cat.join(",");
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" ")
          };
          this.goodsInfo.attrs.push(newInfo);
        });
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals };
          this.goodsInfo.attrs.push(newInfo);
        });
        form.attrs = this.goodsInfo.attrs;
        // console.log(form);
		
        Addgoods(form)
          .then(res => {
            // console.log(res);
            if (res.meta.status !== 201) {
              return this.$message.error("添加商品失败！");
            }

            this.$message.success("添加商品成功！");
            this.$router.push('/goods')
          })
          .catch(function(error) {
            console.log(error);
          });
      });
    },
    tabsClick() {
      console.log(this.activeIndex);
      if (this.activeIndex == "1") {
        manyTableData(this.cateId).then(res => {
          console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error("获取动态参数列表失败！");
          }
          res.data.forEach(item => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
          });
          this.manyTableData = res.data;
        });
      } else if (this.activeIndex === "2") {
        onlyTableData(this.cateId).then(res => {
          console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error("获取静态属性失败！");
          }

          console.log(res.data);
          this.onlyTableData = res.data;
        });
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.goodsInfo.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类！");
        return false;
      }
    },
    handleChange() {
      if (this.goodsInfo.goods_cat.length !== 3) {
        this.goodsInfo.goods_cat = [];
      }
    },
    handleRemove(file) {
      //   console.log(file);
      const filePath = file.response.data.tmp_path;
      const i = this.goodsInfo.pics.findIndex(x => x.pic === filePath);
      this.goodsInfo.pics.splice(i, 1);
      console.log(this.goodsInfo);
    },
    handleSuccess(response) {
      console.log(response);
      const picInfo = { pic: response.data.tmp_path };
      this.goodsInfo.pics.push(picInfo);
      console.log(this.goodsInfo);
    },
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.url;
      this.previewVisible = true;
    }
  },
  computed: {
    cateId() {
      // console.log(this.goodsInfo.goods_cat)
      if (this.goodsInfo.goods_cat.length === 3) {
        return this.goodsInfo.goods_cat[2];
      }
      return null;
    }
  }
};
</script>
 
<style scoped>
.Imgs {
  width: 100%;
}
</style>
