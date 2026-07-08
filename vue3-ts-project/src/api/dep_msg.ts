import instance from "../http/index";

// 获取个人部门消息 参数 id department

export const getDepartmentMsg = (id: number, department: string) => {
  return instance.post("/dm/getDepartmentMsg", {
    id,
    department,
  });
};
// 获取部门消息
export const getDepartmentMsgList = (department: string) => {
  return instance.post("/dm/getDepartmentMsgList", {
    department,
  });
};
// 返回用户的阅读列表及状态
export const getReadListAndStatus = (id: number) => {
  return instance.post("/dm/getReadListAndStatus", {
    id,
  });
};

// 用户点击消息后,对read_list内的数据进行删减 参数 消息的readId 以及 用户的id
export const clickDelete = (readId: number, id: number) => {
  return instance.post("/dm/clickDelete", {
    readId,
    id,
  });
};
// 把新发布文章的id插入到当前所属部门的用户的read_list中 参数 新发布文章的newid 对应的部门 department
export const changeUserReadList = (newId: number, department: string) => {
  return instance.post("/dm/changeUserReadList", {
    newId,
    department,
  });
};
// 把删除的文章的id从当前所属部门的用户的read_list中删除 参数 新发布文章的deleteid 对应的部门 department
export const changeUserReadListButDelete = (
  deleteid: number,
  department: string
) => {
  return instance.post("/dm/changeUserReadListButDelete", {
    deleteid,
    department,
  });
};
