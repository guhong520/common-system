<!--删除公司公告和系统消息，还原消息与真正删除 -->
<script lang="ts" setup>
import { ref, onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";
import { bus } from "../../utils/mitt";
import { firstDelete, deleteMessage, recover } from "../../api/message";
import {
  changeUserReadListButDelete,
  changeUserReadList,
} from "../../api/dep_msg";
import { useMessageStore } from "../../store/message";
const messageStore = useMessageStore();
const dialogVisible = ref(false);
const title = ref("");
const open = () => {
  dialogVisible.value = true;
};
defineExpose({
  open,
});
bus.on("delAnnounceOrSystem", (title1: any) => {
  title.value = title1;
});

const delId = ref(0);
const department = ref<string>("");
bus.on("delFirstAnnouncement", (row: any) => {
  delId.value = row.id;
  department.value = row.message_receipt_object;
});
const deleteFisrtAnnouncement = async () => {
  let id, res;
  if (title.value == "删除公司公告") {
    id = 1;
    res = await firstDelete(delId.value);
    // 给该部门下所有员工添加部门消息
    await changeUserReadListButDelete(delId.value, department.value);
    // 更新一下store
    await messageStore.reurnReadList(
      localStorage.getItem("id") as unknown as number
    );
  }
  if (title.value == "删除系统消息") {
    id = 2;
    res = await firstDelete(delId.value);
  }
  if (title.value == "真正删除") {
    res = await deleteMessage(delId.value);
    // 更新回收站组件
    id = 3;
  }
  if (title.value == "还原消息") {
    res = await recover(delId.value);
    // 给该部门下所有员工添加部门消息
    await changeUserReadList(delId.value, department.value);
    // 更新一下store
    await messageStore.reurnReadList(
      localStorage.getItem("id") as unknown as number
    );
    id = 4;
  }
  if (res) {
    if (res.data.status === 0) {
      // 通知父组件更新数据
      bus.emit("refreshAnnouncement", id);
    }
  } else {
    ElMessage({
      message: "服务异常",
      type: "error",
    });
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
    <span v-if="title == '删除公司公告'"
      >你确定删除当前公告吗？删除后此消息将会出现在回收站中。</span
    >
    <span v-if="title == '删除系统消息'"
      >你确定删除当前系统消息吗？删除后此消息将会出现在回收站中。</span
    >
    <span v-if="title == '还原消息'"
      >你确定还原当前消息吗？还原后此消息将会出现在消息列表中。</span
    >
    <span v-if="title == '永久删除'">请谨慎操作，您正在永久删除此消息</span>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="danger" @click="deleteFisrtAnnouncement"
        >确 定</el-button
      >
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
