import instance from "../http/index";
// import type { fileData } from "../types/file";

// 绑定上传者
export const bindFileAndUser = (name: string, url: string) => {
  return instance.post("/file/bindFileAndUser", { name, url });
};
// 更新下载量
export const updateDownload = (download_number: number, id: number) => {
  return instance.post("/file/updateDownload", { download_number, id });
};
// 搜索文件
export const searchFile = (file_name: string) => {
  return instance.post("/file/searchFile", { file_name });
};
// 删除文件 id file_name
export const deleteFile = (id: number, file_name: string) => {
  return instance.post("/file/deleteFile", { id, file_name });
};

// 下载文件

export const downloadFile = (id: number, file_url: string) => {
  return instance.post("/file/downloadFile", { id, file_url });
};
// 获取文件列表
export const fileList = () => {
  return instance.post("/file/fileList");
};
// 获取文件列表总数
export const fileListLength = () => {
  return instance.post("/file/fileListLength");
};
// 监听换页返回数据 文件列表
export const returnFilesListData = (pager: number) => {
  return instance.post("/file/returnFilesListData", { pager });
};
