<!--撤回申请 -->
<script lang="ts" setup>
import { ref, onBeforeUnmount } from "vue";

import { bus } from "../../utils/mitt";
import { withdrawApplyProduct } from "../../api/product";
const dialogVisible = ref(false);
const open = () => {
  dialogVisible.value = true;
};
defineExpose({
  open,
});
// 通知父组件刷新
//撤回产品申请
const withDrawId = ref(0);
bus.on("withDrawId", (id: any) => {
  withDrawId.value = id;
});
const withDrawProduct = async () => {
  const res = await withdrawApplyProduct(withDrawId.value);
  console.log(res);
  if (res && res.data.status === 0) {
    // 通知父组件更新数据
    bus.emit("withDrawSuccess", 1);
  }
  dialogVisible.value = false;
};
onBeforeUnmount(() => {
  bus.all.clear();
});
</script>
<template>
  <el-dialog v-model="dialogVisible" title="" width="600" draggable="true">
    <span>确定取消此产品的入库吗？</span>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="withDrawProduct">确 定</el-button>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
