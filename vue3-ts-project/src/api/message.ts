import instance from "../http/index";
import { type messageData } from "../types/message";

// 发布消息
export const publishMessage = (data: messageData) => {
  const {
    message_title,
    message_category,
    message_publish_department,
    message_publish_name,
    message_receipt_object,
    message_content,
    message_level,
  } = data;
  return instance.post("/msg/publishMessage", {
    message_title,
    message_category,
    message_publish_department,
    message_publish_name,
    message_receipt_object,
    message_content,
    message_level,
  });
};

// 获取公司公告列表
export const companyMessageList = () => {
  return instance.post("/msg/companyMessageList");
};
// 获取系统消息列表
export const systemMessageList = () => {
  return instance.post("/msg/systemMessageList");
};
// 编辑公告
export const editMessage = (data: messageData) => {
  const {
    message_title,
    message_publish_name,
    message_content,
    message_receipt_object,
    message_level,
    id,
  } = data;
  return instance.post("/msg/editMessage", {
    message_title,
    message_publish_name,
    message_content,
    message_receipt_object,
    message_level,
    id,
  });
};
// 根据发布部门进行获取消息
export const searchMessageBydepartment = (
  message_publish_department: string
) => {
  return instance.post("/msg/searchMessageBydepartment", {
    message_publish_department,
  });
};
// 根据发布等级进行获取消息
export const searchMessageByLevel = (message_level: string) => {
  return instance.post("/msg/searchMessageByLevel", {
    message_level,
  });
};
// 获取公告/系统消息
export const getMessage = (id: string) => {
  return instance.post("/msg/getMessage", { id });
};

// 更新点击率
export const updateClick = (message_click_number: number, id: number) => {
  return instance.post("/msg/updateClick", { message_click_number, id });
};
// 初次删除
export const firstDelete = (id: number) => {
  return instance.post("/msg/firstDelete", { id });
};
// 获取回收站的列表
export const recycleList = () => {
  return instance.post("/msg/recycleList");
};
// 还原操作
export const recover = (id: number) => {
  return instance.post("/msg/recover", { id });
};
// 删除操作
export const deleteMessage = (id: number) => {
  return instance.post("/msg/deleteMessage", { id });
};
// 获取回收站总数
export const getRecycleMessageLength = () => {
  return instance.post("/msg/getRecycleMessageLength");
};
// 获取公司公告总数
export const getCompanyMessageLength = () => {
  return instance.post("/msg/getCompanyMessageLength");
};
// 获取系统消息总数
export const getSystemMessageLength = () => {
  return instance.post("/msg/getSystemMessageLength");
};
// 监听换页公司公告列表
export const returnCompanyListData = (pager: number) => {
  return instance.post("/msg/returnCompanyListData", { pager });
};
// 监听换页系统消息列表
export const returnSystemListData = (pager: number) => {
  return instance.post("/msg/returnSystemListData", { pager });
};
// 回收站监听换页
export const returnRecycleListData = (pager: number) => {
  return instance.post("/msg/returnRecycleListData", { pager });
};
