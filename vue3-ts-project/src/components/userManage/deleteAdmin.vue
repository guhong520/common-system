<!-- 删除用户，删除产品入库，降职管理员 -->
<script lang="ts" setup>
import { ref, onBeforeUnmount, reactive } from "vue";
import { changeIdentityToUser, deleteUser } from "../../api/userInfo";
import { deleteProduct } from "../../api/product";
import { ElMessage } from "element-plus";
import { bus } from "../../utils/mitt";
import { withTracking } from "../../utils/operation";
import { useUserInfo } from "../../store/userInfo";
const userInfo = useUserInfo();
const dialogVisible = ref(false);
// 传入过来的title
bus.on("ident", (ident: any) => {
  title.value = `删除${ident}`;
});
// 传过来删除id与账号
bus.on("deleteId", (row: any) => {
  deleteUserParams.id = row.id;
  // 传过来名字，与删除用户id同用
  deleteUserParams.account = row.name;
});
bus.on("deleteAccount", (account: any) => {
  deleteUserParams.account = account;
});
const open = () => {
  dialogVisible.value = true;
};
defineExpose({
  open,
});
const title = ref("");
// 通知父组件刷新
// 创建管理员
// 统一操作参数
const deleteUserParams = reactive({
  id: 0,
  account: "",
});

// 初始化带跟踪的操作,高阶函数返回一个promise函数
const trackedDeleteUser = withTracking(
  userInfo.name as string,
  "删除",
  "高级",
  async (params) => deleteUser(params.id, params.account)
);

const trackedChangeIdentity = withTracking(
  userInfo.name as string,
  "降职",
  "高级",
  async (params) => changeIdentityToUser(params.id)
);
const delAdmin = async () => {
  try {
    if (title.value === "删除用户") {
      await trackedDeleteUser(deleteUserParams);
    } else if (title.value === "删除入库产品") {
      await deleteProduct(deleteUserParams.id);
    } else {
      await trackedChangeIdentity(deleteUserParams);
    }
    bus.emit("refresh", 2);
  } catch (error) {
    ElMessage.error((error as Error).message || "操作失败");
  } finally {
    dialogVisible.value = false;
  }
};
onBeforeUnmount(() => {
  bus.all.clear();
});
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="600"
    draggable="true"
  >
    <span v-if="title === '删除用户'"
      >请谨慎操作，删除后此用户将永久失去登录资格</span
    >
    <span v-else-if="title === '删除入库产品'"
      >是否要删掉此入库产品？删除后此产品将不会出现在入库列表</span
    >
    <span v-else
      >是否去掉此用户的管理员职位？删除后此用户将重新出现在用户列表</span
    >
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="delAdmin">确 定</el-button>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
