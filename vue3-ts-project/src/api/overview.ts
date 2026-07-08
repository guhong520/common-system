import instance from "../http/index";

// 获取产品类别和总价
export const getCategoryAndNumber = () => {
  return instance.post("/ov/getCategoryAndNumber");
};
// 获取不同角色与数量
export const getAdminAndNumber = () => {
  return instance.post("/ov/getAdminAndNumber");
};
// 获取不同消息等级与数量
export const getLevelAndNumber = () => {
  return instance.post("/ov/getLevelAndNumber");
};
// 返回每天登录人数
export const getDayAndNumber = () => {
  return instance.post("/ov/getDayAndNumber");
};
