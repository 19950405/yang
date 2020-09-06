<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-top: 15px;">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="userInfo.query" clearable @click="getUsers">
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table :data="UsersData" style="width: 100%">
        <el-table-column type="index" label="#" width="80"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model.number="scope.row.mg_state" @change="userSwitchChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="EditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUser(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="userInfo.pagenum"
          :page-sizes="[2,3,4]"
          :page-size="userInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top: 27px;"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 修改用户 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{userRole.username}}</p>
        <p>当前的角色：{{userRole.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsers,
  getAddUsers,
  getUserType,
  getEditDialog,
  EditDialogs,
  getRemoveUser,
  getUserRole,
  UserRole
} from "@/network/get.js";
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb();
      }

      cb(new Error("请输入合法的邮箱"));
    };

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };
    return {
      userInfo: {
        query: "",
        pagenum: 1,
        pagesize: 4
      },
      total: 0,
      editDialogVisible: false,
      addDialogVisible: false,
      setRoleDialogVisible: false,
      UsersData: [],
      userState: {},
      editForm: {},
      addForm: { 
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editFormRules: {
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入用户手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6~15个字符之间",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      userRole: {},
      selectedRoleId: "",
      rolesList: []
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.userInfo.pagesize = newSize;
      this.getUsers();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      //   console.log(newPage);
      this.userInfo.pagenum = newPage;
      this.getUsers();
    },
    // 获取列表数据
    getUsers() {
      getUsers(this.userInfo).then(res => {
        // console.log(res)
        this.UsersData = res.data.users;
        this.total = res.data.total;
        // console.log(this.UsersData);
      });
    },
    // 监听用户状态
    userSwitchChanged(userState) {
      //   console.log(userState);
      getUserType(userState).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state;
          return this.$message.error("更新用户状态失败！");
        }
        this.$message.success("更新用户状态成功！");
      });
    },
    // 编辑用户信息
    EditDialog(id) {
      getEditDialog(id).then(res => {
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error("查询用户信息失败！");
        }
        this.editForm = res.data;
        this.editDialogVisible = true;
        // console.log(this.editForm);
      });
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        // console.log(this.editForm)
        EditDialogs(this.editForm).then(res => {
          //   console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error("更新用户信息失败！");
          }
          // 关闭对话框
          this.editDialogVisible = false;
          // 刷新数据列表
          this.getUsers();
          // 提示修改成功
          this.$message.success("更新用户信息成功！");
        });
      });
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        // 可以发起添加用户的网络请求
        getAddUsers(this.addForm).then(res => {
          console.log(res);
          if (res.meta.status !== 201) {
            this.$message.error("添加用户失败！");
          }

          this.$message.success("添加用户成功！");
          // 隐藏添加用户的对话框
          this.addDialogVisible = false;
          // 重新获取用户列表数据
          this.getUsers();
        });
      });
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 删除用户
    removeUser(id) {
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
          getRemoveUser(id).then(res => {
            console.log(res);
            if (res.meta.status !== 200) {
              return this.$message.error("删除用户失败！");
            }

            this.$message.success("删除用户成功！");
            this.getUsers();
          });
        })
        .catch(err => {
          return this.$message.info("已取消删除");
        });
    },
    // 分配角色页面展示
    setRole(userRole) {
      this.userRole = userRole;
      // console.log(this.userRole)
      this.setRoleDialogVisible = true;
      getUserRole().then(res => {
        // console.log(res)
        this.rolesList = res.data;
        if (res.meta.status !== 200) {
          return this.$message.error("获取角色列表失败！");
        }
      });
    },
    // 点击分配
    saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error("请选择要分配的角色");
      }
      UserRole(this.userRole, this.selectedRoleId).then(res => {
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("更新角色失败！");
        }

        this.$message.success("更新角色成功！");
        this.getUsers();
        this.setRoleDialogVisible = false;
      });
    },
    setRoleDialogClosed() {
      this.selectedRoleId = "";
      this.userInfo = {};
    }
  }
};
</script>

<style scoped>
</style>
