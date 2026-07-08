<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { type UserInfo } from "../../types/userInfo";
import { getUserInfo } from "../../api/userInfo";
import { editAdmin } from "../../api/userInfo";
import { getDepartment } from "../../api/setting";
import { bus } from "../../utils/mitt";
// 获取部门数据
const departmentList = ref();
const getdepartment = async () => {
  const res = await getDepartment();
  departmentList.value = res.data;
};
onMounted(() => {
  getdepartment();
});
// 接受传过来的id
bus.on("editId", (id: any) => {
  EditId.value = id;
});
const open = () => {
  getUserInfor(EditId.value);
  dialogVisible.value = true;
};
bus.on("ident", (ident: any) => {
  if (ident == "产品管理员") {
    title.value = "编辑产品管理员";
    ruleForm.identity = "产品管理员";
  } else if (ident == "用户管理员") {
    title.value = "编辑用户管理员";
    ruleForm.identity = "用户管理员";
  } else if (ident == "消息管理员") {
    title.value = "编辑消息管理员";
    ruleForm.identity = "消息管理员";
  } else if (ident == "用户") {
    title.value = "编辑用户";
    ruleForm.identity = "用户";
  }
});
const dialogVisible = ref(false);
const title = ref();
const EditId = ref();

defineExpose({
  open,
});
const ruleFormRef = ref();
const ruleForm: UserInfo = reactive({
  id: 0,
  account: "",
  name: "",
  sex: "",
  email: "",
  department: "",
  identity: "",
});
const getUserInfor = async (id: number) => {
  const res = await getUserInfo(id);
  ruleForm.name = res.data.name;
  ruleForm.sex = res.data.sex;
  ruleForm.email = res.data.email;
  ruleForm.account = res.data.account;
  ruleForm.department = res.data.department;
};

const rules = reactive({
  name: [{ required: true, message: "请输入管理员姓名", trigger: "blur" }],
  sex: [{ required: true, message: "请选择性别", trigger: "change" }],
  email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
  department: [
    { required: true, message: "请选择管理员部门", trigger: "change" },
  ],
});
// 编辑管理员
const editadmin = async () => {
  ruleForm.id = EditId.value;
  const res = await editAdmin(ruleForm);
  if (res.data.status === 0) {
    // 通知父组件更新数据
    bus.emit("refresh", 1);
  }
  dialogVisible.value = false;
};
// 销毁组件
onBeforeUnmount(() => {
  bus.all.clear();
});
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="500"
    draggable="true"
  >
    <div class="dialog-content">
      <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="ruleForm.account" disabled />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="ruleForm.sex" placeholder="请选择性别">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="ruleForm.department" placeholder="请选择部门">
            <el-option
              v-for="item in departmentList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editadmin"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.dialog-content {
  padding: 20px 30px;
}
:deep(.el-form-item) {
  margin: 30px;
}
</style>
