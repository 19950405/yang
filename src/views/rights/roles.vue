<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top: 15px;">
      <el-col :span="2">
        <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
      </el-col>

      <el-table :data="getRoleData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in props.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(props.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环 嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(props.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
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
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index" width="80"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <!-- 分配权限按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetDialog(scope.row)"
              >分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="TreeList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserRole, DeleRote, getRoleData, Role } from "@/network/get.js";
export default {
  data() {
    return {
      getRoleData: [],
      statu: false,
      setRightDialogVisible: false,
      TreeList: [],
      defKeys: [],
      treeProps: {
        label: "authName",
        children: "children"
      },
      roleId: ""
    };
  },
  created() {
    this.getUserRole();
  },
  methods: {
    get(i) {
      console.log(i);
    },
    removeRightById(role, roleId) {
      console.log(role, roleId);
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
          DeleRote(role, roleId).then(res => {
            // console.log(res);
            if (res.meta.status !== 200) {
              return this.$message.error("删除用户失败！");
            }
            this.$message.success("删除用户成功！");
            this.getUserRole();
            // console.log(role);
            role.children = res.data;
          });
        })
        .catch(err => {
          //   console.log(err);
          return this.$message.info("已取消删除");
        });
    },
    getUserRole() {
      getUserRole().then(res => {
        // console.log(res);
        this.getRoleData = res.data;
      });
    },
    // 点击显示分配权限
    showSetDialog(role) {
      this.setRightDialogVisible = true;
      // console.log(role)
      this.roleId = role.id;
      getRoleData().then(res => {
        // console.log(res)
        this.TreeList = res.data;
        this.getLeafKeys(role, this.defKeys);
      });
    },
    allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
	  const idStr = keys.join(",");
	  console.log(this.roleId)
      Role(this.roleId, idStr).then(res => {
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("分配权限失败！");
        }

        this.$message.success("分配权限成功！");
        this.getUserRole();
        this.setRightDialogVisible = false;
      });
    },
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach(item => this.getLeafKeys(item, arr));
    },
    setRightDialogClosed() {
      this.defKeys = [];
    }
  }
};
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
