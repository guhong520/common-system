import instance from "../http/index";
// 操作记录
export const operationLog = (
  operation_person: string,
  operation_content: string,
  operation_level: string
) => {
  return instance({
    url: "/olog/operationLog",
    method: "post",
    data: {
      operation_person,
      operation_content,
      operation_level,
    },
  });
};
// 登录记录
export const loginLog = (account: string, name: string, email: string) => {
  return instance({
    url: "/llog/loginLog",
    method: "post",
    data: {
      account,
      name,
      email,
    },
  });
};
// 返回登录日志列表
export const loginLogList = () => {
  return instance({
    url: "/llog/loginLogList",
    method: "post",
  });
};
// 返回操作日志列表
export const operationLogList = () => {
  return instance({
    url: "/olog/operationLogList",
    method: "post",
  });
};
// 返回登录日志列表的长度
export const loginLogListLength = () => {
  return instance({
    url: "/llog/loginLogListLength",
    method: "post",
  });
};
// 返回操作日志列表的长度
export const operationLogListLength = () => {
  return instance({
    url: "/olog/operationLogListLength",
    method: "post",
  });
};

// 监听换页返回数据  登录日志列表
export const returnLoginListData = (pager: number) => {
  return instance({
    url: "/llog/returnLoginListData",
    method: "post",
    data: {
      pager,
    },
  });
};

// 监听换页返回数据  操作日志列表
export const returnOperationListData = (pager: number) => {
  return instance({
    url: "/olog/returnOperationListData",
    method: "post",
    data: {
      pager,
    },
  });
};
// 清空登录日志 truncate

export const clearLoginLogList = () => {
  return instance({
    url: "/llog/clearLoginLogList",
    method: "post",
  });
};
// 清空操作日志 truncate

export const clearOperationLogList = () => {
  return instance({
    url: "/olog/clearOperationLogList",
    method: "post",
  });
};
// 搜索最近十条操作记录
export const searchOperationLogList = (operation_person: string) => {
  return instance({
    url: "/olog/searchOperationLogList",
    method: "post",
    data: {
      operation_person,
    },
  });
};
// 搜索最近十条登录记录
export const searchLoginLogList = (account: string) => {
  return instance({
    url: "/llog/searchLoginLogList",
    method: "post",
    data: {
      account,
    },
  });
};
