<script lang="ts" setup>
import { ref, reactive, onBeforeUnmount } from "vue";
import type { LoginData1 } from "../../types/login";
import { ElMessage } from "element-plus";
import { verify, resetPassword } from "../../api/login";
import { bus } from "../../utils/mitt";
const state = reactive({
  ForgetDialog: false,
  passwordDialog: false,
});
const labelPosition = ref("top");
const ForgetData: LoginData1 = reactive({
  account: "",
  email: "",
  password: "",
  repassword: "",
});
const FormRef = ref();
const rules = ref({
  account: [
    { required: true, message: "Please input account", trigger: "blur" },
    { min: 6, max: 12, message: "长度为6到12位", trigger: "blur" },
  ],
  email: [
    { required: true, message: "Please input email", trigger: "blur" },
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"],
    },
  ],
  password: [
    { required: true, message: "Please input password", trigger: "blur" },
    {
      min: 6,
      max: 12,
      message: "长度为6到12位且不能是纯数字",
      trigger: "blur",
    },
  ],
  repassword: [
    { required: true, message: "Please input password", trigger: "blur" },
    {
      min: 6,
      max: 12,
      message: "长度为6到12位且不能是纯数字",
      trigger: "blur",
    },
  ],
});
bus.on("forgetOrEditPass", (id: any) => {
  if (id === 1) {
    state.ForgetDialog = true;
    state.passwordDialog = false;
  } else {
    state.ForgetDialog = false;
    state.passwordDialog = true;
  }
});
const open = () => {};
defineExpose({
  open,
});
// 验证账号
const verifyAccount = async () => {
  const res = await verify({
    account: ForgetData.account,
    email: ForgetData.email,
  });
  if (res.data.status === 0) {
    localStorage.setItem("id", res.data.id);
    state.passwordDialog = true;
    state.ForgetDialog = false;
  }
};
//  修改密码
const ResetPassword = async () => {
  if (ForgetData.password == ForgetData.repassword) {
    const newPassword = ForgetData.password;
    const res = await resetPassword({
      id: localStorage.getItem("id") as unknown as number,
      newPassword: newPassword,
    });
    if (res.data.status === 0) {
      state.passwordDialog = false;
    }
  } else {
    ElMessage.error("两次密码不一致");
  }
};
onBeforeUnmount(() => {
  bus.all.clear();
});
</script>
<template>
  <!-- 忘记密码 -->
  <el-dialog v-model="state.ForgetDialog" title="忘记密码" width="30%">
    <el-form
      :rules="rules"
      ref="FormRef"
      :model="ForgetData"
      class="ruleForm"
      :label-position="labelPosition"
    >
      <div style="width: 95%">
        <el-form-item label="账号" prop="account">
          <el-input
            v-model="ForgetData.account"
            autocomplete="off"
            placeholder="请输入账号"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="ForgetData.email"
            autocomplete="off"
            placeholder="请输入邮箱"
          />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="state.ForgetDialog = false">取消</el-button>
        <el-button type="primary" @click="verifyAccount"> 下一步 </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 修改密码 -->
  <el-dialog v-model="state.passwordDialog" title="忘记密码" width="30%">
    <el-form
      ref="ruleFormRef"
      class="ruleForm"
      :label-position="labelPosition"
      :model="ForgetData"
    >
      <div style="width: 95%">
        <el-form-item label="输入你的新密码" required prop="password">
          <el-input
            v-model="ForgetData.password"
            autocomplete="off"
            placeholder="请输入你的密码"
          />
        </el-form-item>
        <el-form-item label="请确人你的密码" required prop="repassword">
          <el-input
            v-model="ForgetData.repassword"
            autocomplete="off"
            placeholder="请再次输入你的新密码"
          />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="state.passwordDialog = false">取消</el-button>
        <el-button type="primary" @click="ResetPassword"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss"></style>
