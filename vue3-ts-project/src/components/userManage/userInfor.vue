<script lang="ts" setup>
import { ref, reactive, onBeforeUnmount } from "vue";
import editAdmin from "../../components/userManage/editAdmin.vue";
import deleteAdmin from "../../components/userManage/deleteAdmin.vue";
import { type UserInfo } from "../../types/userInfo";
import { bus } from "../../utils/mitt";
import promote from "../../components/userManage/promote.vue";

const dialogVisible = ref(false);
const open = () => {
  dialogVisible.value = true;
};
const cancel = () => {
  dialogVisible.value = false;
};
const promoteRef = ref();
const openPromote = () => {
  // 传给赋权组件的数据
  bus.emit("userid", userData.id);
  promoteRef.value.open();
};
defineExpose({
  open,
  cancel,
});
const userData: UserInfo = reactive({
  id: 0,
  imageUrl: "",
  account: "",
  name: "",
  sex: "",
  department: "",
  email: "",
  status: 0,
});
// 接受userList组件的数据
bus.on("userId", (row: any) => {
  if (row) {
    userData.imageUrl = row.image_url;
    userData.account = row.account;
    userData.name = row.name;
    userData.sex = row.sex;
    userData.department = row.department;
    userData.email = row.email;
    userData.status = row.status;
    userData.id = row.id;
  }
});
const editAdminRef = ref();
const openEditAdmin = () => {
  // 传给编辑组件的数据
  bus.emit("ident", "用户");
  bus.emit("editId", userData.id);
  editAdminRef.value.open();
};

const deleteAdminRef = ref();
const openDeleteAdmin = () => {
  // 传给删除组件的数据
  bus.emit("ident", "用户");
  bus.emit("deleteId", userData);
  bus.emit("deleteAccount", userData.account);
  deleteAdminRef.value.open();
};

// 销毁组件
onBeforeUnmount(() => {
  bus.all.clear();
});
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    title="用户信息"
    width="600"
    draggable="true"
    centers
  >
    <el-container class="dialog-content">
      <el-aside width="200px">
        <el-avatar
          shape="square"
          :size="120"
          :src="userData.imageUrl"
        ></el-avatar>
      </el-aside>
      <el-main>
        <div>账号:{{ userData.account }}</div>
        <div>姓名:{{ userData.name }}</div>
        <div>性别:{{ userData.sex }}</div>
        <div>部门:{{ userData.department }}</div>
        <div>邮箱:{{ userData.email }}</div>
        <div>
          状态:
          <span v-if="userData.status === 0">正常</span>
          <span v-else>冻结</span>
        </div>
      </el-main>
    </el-container>
    <el-footer>
      <span @click="openEditAdmin">编辑</span>
      <span @click="openPromote">赋权</span>
      <span @click="openDeleteAdmin">删除用户</span>
    </el-footer>
    <promote ref="promoteRef"></promote>
    <editAdmin ref="editAdminRef"></editAdmin>
    <deleteAdmin ref="deleteAdminRef"></deleteAdmin>
  </el-dialog>
</template>
<style lang="scss" scoped>
.dialog-content {
  padding: 20px 30px;
}
.el-main > div {
  margin-bottom: 10px;
  padding: 1px;
}
.el-main {
  --el-main-padding: 0;
}
.el-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 30px;
  span {
    margin-right: 20px;
    cursor: pointer;
    color: rgb(71, 153, 230);
  }
}
</style>
