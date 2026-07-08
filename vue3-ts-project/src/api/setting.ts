import instance from "../http/index";
// 获取轮播图
export const getAllSwiper = () => {
  return instance.post("/set/getAllSwiper");
};

// 获取公司名称
export const getCompanyName = () => {
  return instance.post("/set/getCompanyName");
};

// 修改公司名称
export const changeCompanyName = (set_value: string) => {
  return instance.post("/set/changeCompanyName", { set_value });
};

// 编辑公司介绍接口
export const changeCompanyIntroduce = (set_text: string, set_name: string) => {
  return instance.post("/set/changeCompanyIntroduce", { set_text, set_name });
};

// 获取公司介绍
export const getCompanyIntroduce = (set_name: string) => {
  return instance.post("/set/getCompanyIntroduce", { set_name });
};

// 获取所有公司介绍
export const getAllCompanyIntroduce = () => {
  return instance.post("/set/getAllCompanyIntroduce");
};
// 部门设置
export const setDepartment = (data: string) => {
  return instance.post("/set/setDepartment", { set_value: data });
};
// 获取部门
export const getDepartment = () => {
  return instance.post("/set/getDepartment");
};
// 产品类别设置
export const setProduct = (data: string) => {
  return instance.post("/set/setProduct", { set_value: data });
};
// 获取产品
export const getProduct = () => {
  return instance.post("/set/getProduct");
};
