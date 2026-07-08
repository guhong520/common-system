import instance from "../http/index";
import { type UserInfo } from "../types/userInfo";
// 获取用户信息
export const getUserInfo = (id: number) => {
  return instance.post("/user/getUserInfo", { id });
};

// 绑定图片地址跟账号
export const bind = (account: string, onlyId: string, url: string) => {
  return instance.post("/user/bindAccount", { account, onlyId, url });
};
// 修改密码
export const changePassword = (
  id: number,
  oldPassword: string,
  newPassword: string
) => {
  return instance.post("/user/changePassword", {
    id,
    oldPassword,
    newPassword,
  });
};

// 修改姓名
export const changeName = (id: number, name: string) => {
  return instance.post("/user/changeName", { id, name });
};
export const changeSex = (id: number, sex: string) => {
  return instance.post("/user/changeSex", { id, sex });
};

export const changeEmail = (id: number, email: string) => {
  return instance.post("/user/changeEmail", { id, email });
};
// ___________________________________________________________________________用户管理

// 添加管理员
export const addAdmin = (data: UserInfo) => {
  const { account, ...identity } = data;
  return instance.post("/user/createAdmin", { account, ...identity });
};
// 获取管理员列表
export const getAdminList = (identity: string) => {
  return instance.post("/user/getAdminList", { identity });
};
// 编辑管理员信息
export const editAdmin = (data: UserInfo) => {
  const { id, ...department } = data;
  return instance.post("/user/editAdmin", { id, ...department });
};
// 对管理员取消赋权
export const changeIdentityToUser = (id: number) => {
  return instance.post("/user/changeIdentityToUser", { id });
};
// 对用户进行赋权
export const changeIdentityToAdmin = (id: number, identity: string) => {
  return instance.post("/user/changeIdentityToAdmin", { id, identity });
};
// 通过账号对用户进行搜索
// 导出一个名为searchUser的函数，该函数接收一个参数account，返回一个post请求，请求的url为"/user/searchUser"，请求的参数为account
export const searchUser = (account: string, identity: string) => {
  return instance.post("/user/searchUser", { account, identity });
};
// 根据部门搜索用户
export const searchUserByDepartment = (department: string) => {
  return instance.post("/user/searchUserByDepartment", { department });
};
// 冻结用户
export const banUser = (id: number) => {
  return instance.post("/user/banUser", { id });
};
// 解冻用户
export const hotUser = (id: number) => {
  return instance.post("/user/hotUser", { id });
};
// 获取冻结用户列表
export const getBanList = () => {
  // 使用instance.post方法，发送post请求，请求地址为"/user/getBanList"
  return instance.post("/user/getBanList");
};
// 删除用户
export const deleteUser = (id: number, account: string) => {
  return instance.post("/user/deleteUser", { id, account });
};
// 获取对应身份的总人数
export const getIdentityLength = (identity: string) => {
  return instance.post("/user/getAdminListLength", { identity });
};
// 监听换页返回数据
export const returnListData = (pager: number, identity: string) => {
  return instance.post("/user/returnListData", { pager, identity });
};
