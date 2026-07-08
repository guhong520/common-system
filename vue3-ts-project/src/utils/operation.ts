import { operationLog } from "../api/log";
const tracking = async (
  module: string,
  operation_person: string,
  operation_object: string,
  operation_mode: string,
  operation_level: string
) => {
  let operation_content = "";
  if (module == "管理员") {
    // 操作内容
    operation_content =
      operation_person +
      "对" +
      operation_object +
      "进行了" +
      operation_mode +
      "操作";
  }
  await operationLog(operation_person, operation_content, operation_level);
};
// 定义操作参数类型
interface OperationParams {
  id: number;
  account: string;
}

// 增强版高阶函数
export const withTracking =
  <T extends (params: OperationParams) => Promise<any>>(
    name: string,
    actionName: string,
    level: "高级" | "中级" | "低级",
    handler: T
  ) =>
  async (params: OperationParams) => {
    try {
      const result = await handler(params);
      if (result.data.status === 0) {
        await tracking("管理员", name, params.account || "", actionName, level);
      }
      return result;
    } catch (error) {
      await tracking(
        "管理员",
        name,
        params.account || "",
        `${actionName}失败`,
        "错误"
      );
      throw error;
    }
  };
