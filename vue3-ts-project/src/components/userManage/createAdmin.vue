<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { type UserInfo } from "../../types/userInfo";
import { addAdmin } from "../../api/userInfo";
import { getDepartment } from "../../api/setting";
import { bus } from "../../utils/mitt";
const dialogVisible = ref(false);
const title = ref();
const open = () => {
  resetForm();
  dialogVisible.value = true;
};
defineExpose({
  open,
});
const ruleFormRef = ref();
// 重置表单数据的方法
const resetForm = () => {
  Object.assign(ruleForm, {
    account: null,
    password: "",
    name: "",
    sex: "",
    email: null,
    department: "",
    identity: "",
  });
};
const ruleForm: UserInfo = reactive({
  account: "",
  password: "",
  name: "",
  sex: "",
  email: "",
  department: "",
  identity: "",
});
const rules = reactive({
  account: [{ required: true, message: "请输入管理员账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入管理员密码", trigger: "blur" }],
  name: [{ required: true, message: "请输入管理员姓名", trigger: "blur" }],
  sex: [{ required: true, message: "请选择性别", trigger: "change" }],
  email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
  department: [
    { required: true, message: "请选择管理员部门", trigger: "change" },
  ],
});
//接受传过来的title，并定义身份
bus.on("manageTitle", (title1: any) => {
  title.value = title1;
});

// 定义success事件，并返回一个emit
const emit = defineEmits(["success"]);
// 创建管理员
const createAdmin = async () => {
  if (title.value == "添加产品管理员") {
    ruleForm.identity = "产品管理员";
  }
  if (title.value == "添加消息管理员") {
    ruleForm.identity = "消息管理员";
  }
  if (title.value == "添加用户管理员") {
    ruleForm.identity = "用户管理员";
  }
  const res = await addAdmin(ruleForm);
  if (res.data.status === 0) {
    emit("success");
  }
  dialogVisible.value = false;
};
const departmentList = ref();
const getdepartment = async () => {
  const res = await getDepartment();
  departmentList.value = res.data;
};
onMounted(() => {
  getdepartment();
});
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
    :destroy-on-close="true"
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
          <el-input v-model="ruleForm.account" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" />
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
        <el-button type="primary" @click="createAdmin"> 确认 </el-button>
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
