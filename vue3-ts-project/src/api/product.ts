import instance from "../http/index";
import { type productData } from "../types/product";
// 创建产品
export const createProduct = (data: productData) => {
  const { product_id, ...in_memo } = data;
  return instance.post("/pro/createProduct", {
    product_id,
    ...in_memo,
  });
};
// 删除产品
export const deleteProduct = (id: number) => {
  return instance.post("/pro/deleteProduct", {
    id,
  });
};
// 编辑产品信息
export const editProduct = (data: productData) => {
  const { id, ...product_name } = data;
  return instance.post("/pro/editProduct", {
    id,
    ...product_name,
  });
};
// 获取产品列表
export const getProductList = () => {
  return instance.post("/pro/getProductList");
};
// 产品申请出库
export const applyOutProduct = (data: productData) => {
  const { id, ...apply_memo } = data;
  return instance.post("/pro/applyOutProduct", {
    id,
    ...apply_memo,
  });
};
// 产品审核列表
export const applyProductList = () => {
  return instance.post("/pro/applyProductList");
};
// 对产品进行撤回申请
export const withdrawApplyProduct = (id: number) => {
  return instance.post("/pro/withdrawApplyProduct", {
    id,
  });
};
// 产品审核
export const auditProduct = (data: productData) => {
  const { id, ...product_out_number } = data;
  return instance.post("/pro/auditProduct", {
    id,
    ...product_out_number,
  });
};
// 通过入库编号对产品进行搜索
export const searchProductForId = (product_id: number) => {
  return instance.post("/pro/searchProductForId", {
    product_id,
  });
};
// 通过出库申请编号对产品进行搜索
export const searchProductForApplyId = (product_out_id: number) => {
  return instance.post("/pro/searchProductForApplyId", {
    product_out_id,
  });
};

// 通过出库编号对产品进行搜索
export const searchProductForOutId = (product_out_id: number) => {
  return instance.post("/pro/searchProductForOutId", {
    product_out_id,
  });
};

// 获取产品总数
export const getProductLength = () => {
  return instance.post("/pro/getProductLength");
};
//出库产品列表
export const auditProductList = () => {
  return instance.post("/pro/auditProductList");
};
// 获取申请出库产品总数
export const getApplyProductLength = () => {
  return instance.post("/pro/getApplyProductLength");
};
// 获取出库产品总数
export const getOutProductLength = () => {
  return instance.post("/pro/getOutProductLength");
};
// 监听换页返回数据  ，产品页面
export const returnProductListData = (pager: number) => {
  return instance.post("/pro/returnProductListData", {
    pager,
  });
};
// 监听返回数据，申请出库页面
export const returnApplyProductListData = (pager: number) => {
  return instance.post("/pro/returnApplyProductListData", {
    pager,
  });
};
// 出库页面
export const returnOutProductListData = (pager: number) => {
  return instance.post("/pro/returnOutProductListData", {
    pager,
  });
};
