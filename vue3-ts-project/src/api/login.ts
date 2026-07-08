import instance from "../http/index";
import type { LoginData1 } from "../types/login";
// 注册
// 导出一个名为register的函数，接收一个参数data，类型为LoginData1
export const register = (data: LoginData1) => {
  // 使用instance.post方法发送POST请求，请求地址为'/api/register'，请求体为data，其中包含username和password
  return instance.post("/api/register", data);
};
// 登录

export const login = (data: LoginData1) => {
  // 使用instance.post方法发送POST请求，请求地址为'/api/register'，请求体为data，其中包含username和password
  return instance.post("/api/login", data);
};
// 获取菜单路由
export const returnMenuList = (id: number) => {
  return instance.post("/api/returnMenuList", { id });
};

// 忘记密码验证
export const verify = (data: LoginData1) => {
  return instance.post("/user/verifyAccountAndEmail", data);
};
// 重置密码
export const resetPassword = (data: LoginData1) => {
  return instance.post("/user/changePasswordInLogin", data);
};
