<!--删除公司公告和系统消息，还原消息与真正删除 -->
<script lang="ts" setup>
import { ref, onBeforeUnmount } from "vue";
import { bus } from "../../utils/mitt";
import { deleteFile } from "../../api/file";
import { clearOperationLogList, clearLoginLogList } from "../../api/log";
const dialogVisible = ref(false);
const title = ref("");
const open = () => {
  dialogVisible.value = true;
};
defineExpose({
  open,
});
bus.on("tipsTitle", (title1: any) => {
  title.value = title1;
});

const iD = ref(0);
const fileName = ref("");
bus.on("tipsBody", (row: any) => {
  iD.value = row.id;
  fileName.value = row.file_name;
});
const operation = async () => {
  let id, res;
  if (title.value == "删除文件") {
    res = await deleteFile(iD.value, fileName.value);
    id = 1;
  }
  if (title.value == "清除操作日志") {
    res = await clearOperationLogList();
    id = 2;
  }
  if (title.value == "清除登录日志") {
    res = await clearLoginLogList();
    id = 3;
  }
  if (res?.data.status === 0) {
    // 通知父组件更新数据
    bus.emit("deleteFile", id);
  }
  dialogVisible.value = false;
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
    <span v-if="title == '删除文件'">请谨慎操作，你确定删除当前文件吗？</span>
    <span v-if="title == '清除操作日志'"
      >请谨慎操作，你确定清除全部日志吗？</span
    >
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="operation">确 定</el-button>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
