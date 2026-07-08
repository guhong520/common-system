<script lang="ts" setup>
import { ref, onBeforeUnmount } from "vue";
import { bus } from "../../utils/mitt";
import { changeIdentityToAdmin } from "../../api/userInfo";
const dialogTableVisible = ref(false);

const open = () => {
  dialogTableVisible.value = true;
};
defineExpose({
  open,
});
const radio = ref("");
const promoteId = ref();
// 赋权操作
const yes = async () => {
  const res = await changeIdentityToAdmin(promoteId.value, radio.value);
  if (res.data.status === 0) {
    bus.emit("refresh", 2);
  }
  dialogTableVisible.value = false;
};
bus.on("userid", (id: any) => {
  promoteId.value = id;
});

// 销毁组件
onBeforeUnmount(() => {
  bus.all.clear();
});
</script>
<template>
  <el-dialog
    class="dialog-content"
    v-model="dialogTableVisible"
    title="赋权操作"
    width="30%"
  >
    <el-radio-group v-model="radio">
      <el-radio value="产品管理员" size="large">产品管理员</el-radio>
      <el-radio value="用户管理员" size="large">用户管理员</el-radio>
      <el-radio value="消息管理员" size="large">消息管理员</el-radio>
    </el-radio-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogTableVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="yes"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.dialog-content {
  padding: 20px 30px;
  .el-radio-group {
    display: flex;
    flex-direction: center;
  }
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 30px;
}
</style>
