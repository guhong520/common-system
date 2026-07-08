<script setup lang="ts">
import { reactive, ref, onBeforeUnmount } from "vue";
import type { LoginData1 } from "../types/login";
import forgetPassword from "../components/Login/forget.vue";
import { register, login, returnMenuList } from "../api/login";
import { useRouter } from "vue-router";
import { useUserInfo } from "../store/userInfo";
import { loginLog } from "../api/log";
import { bus } from "../utils/mitt";
import { useMenu } from "../store/menu";
const userInfoStore = useUserInfo();
const meunStore = useMenu();
const ruleFormRef = ref();
const ruleForm: LoginData1 = reactive({
  account: "",
  password: "",
});
const registerData: LoginData1 = reactive({
  account: "",
  password: "",
  repassword: "",
});
const rules = ref({
  account: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 6, max: 12, message: "长度为6到12位", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      min: 6,
      max: 12,
      message: "长度为6到12位且不能是纯数字",
      trigger: "blur",
    },
  ],
});

const activeName = ref("first");
const forgetP = ref();
const forgetPass = () => {
  forgetP.value.open();
  // 这是忘记密码
  bus.emit("forgetOrEditPass", 1);
};
const router = useRouter();
// 注册
const Register = async () => {
  if (registerData.password == registerData.repassword) {
    const res = await register(registerData);
    if (res.data.message == "注册账号成功") {
      activeName.value = "first";
    }
  }
};
// 登录
const Login = async () => {
  const res = await login(ruleForm);
  if (res.data.message == "登录成功") {
    const res1 = await returnMenuList(res.data.results.id);
    meunStore.setRouter(res1.data);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("name", res.data.results.name);
    localStorage.setItem("id", res.data.results.id);
    localStorage.setItem("department", res.data.results.department);
    await userInfoStore.userInfo(res.data.results.id);
    await loginLog(
      userInfoStore.account as string,
      userInfoStore.name as string,
      userInfoStore.email as string
    );
  }
  router.push("/home");
};
// 重置
const resetLogin = () => {
  if (ruleFormRef.value) {
    ruleFormRef.value.resetFields();
    ruleForm.account = "";
    ruleForm.password = "";
  }
};
const resetRegister = () => {
  registerData.account = "";
  registerData.password = "";
  registerData.repassword = "";
};
onBeforeUnmount(() => {
  bus.all.clear();
});
</script>

<template>
  <div class="login_box">
    <el-card class="box-card">
      <el-tabs v-model="activeName" class="demo-tabs" :stretch="true">
        <el-tab-pane label="登录" name="first">
          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="rules"
            class="ruleForm"
          >
            <h1>后台管理系统</h1>
            <div>
              <el-form-item label="账号" prop="account">
                <el-input v-model="ruleForm.account" autocomplete="off" />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="ruleForm.password"
                  type="password"
                  autocomplete="off"
                />
              </el-form-item>
              <div>
                <div class="forget-password">
                  <span class="forget-password-button" @click="forgetPass"
                    >忘记密码</span
                  >
                </div>
                <div class="footer-button">
                  <el-button class="loginBtn" type="primary" @click="Login">
                    登录
                  </el-button>
                  <el-button class="loginBtn" @click="resetLogin"
                    >重置</el-button
                  >
                </div>
              </div>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="注册" name="second">
          <el-form
            ref="ruleFormRef"
            :model="registerData"
            :rules="rules"
            class="ruleForm"
          >
            <div style="margin: 4% auto">
              <el-form-item label="账号" prop="account">
                <el-input
                  v-model="registerData.account"
                  autocomplete="off"
                  placeholder="账号应为6到12位字符"
                />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  required
                  v-model="registerData.password"
                  type="password"
                  autocomplete="off"
                  placeholder="长度为6到12位且不能是纯数字"
                />
              </el-form-item>
              <el-form-item label="确认密码" prop="password">
                <el-input
                  v-model="registerData.repassword"
                  type="password"
                  autocomplete="off"
                  placeholder="长度为6到12位且不能是纯数字"
                />
              </el-form-item>
            </div>
            <div class="footer-button">
              <el-button class="loginBtn" type="primary" @click="Register">
                注册
              </el-button>
              <el-button class="loginBtn" @click="resetRegister"
                >重置</el-button
              >
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
  <forgetPassword ref="forgetP"></forgetPassword>
</template>

<style scoped lang="scss">
.login_box {
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(../assets/首页.jpg);
  // 设置表单的位置
  display: flex;
  justify-content: center;
  align-items: center;
  .box-card {
    width: 30%;
    height: 36%;
    .forget-password {
      .forget-password-button {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 3%;
        color: #409eff;
      }
    }
  }
}
.ruleForm {
  width: 95%;
  background-color: white;
  border-radius: 15px;
  padding: auto;
}
h1 {
  margin: 3% auto;
  color: gray;
  text-align: center;
  font-size: 24px;
}
.loginBtn {
  width: 40%;
  margin-left: 8%;
  font-size: 14px;
}
:deep(.el-tabs__item) {
  color: #333;
  font-size: 14px;
}
:deep(.el-form-item__label) {
  color: #333;
  font-size: 14px;
}
// :deep(.el-input__inner) {
//   height: 35px;
// }
</style>
