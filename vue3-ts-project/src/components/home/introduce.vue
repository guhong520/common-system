<script lang="ts" setup>
import { onBeforeUnmount, ref, reactive } from "vue";
import { bus } from "../../utils/mitt.js";
// changecompanyintro
import { getCompanyIntroduce } from "../../api/setting.ts";
const title = ref();
// 内容 HTML
const valueHtml = ref();
bus.on("introduce", async (id) => {
  if (id == 1) {
    title.value = "公司介绍";
    const res = await getCompanyIntroduce("公司介绍");
    valueHtml.value = res.data;
  }
  if (id == 2) {
    title.value = "公司架构";
    const res = await getCompanyIntroduce("公司架构");
    valueHtml.value = res.data;
  }
  if (id == 3) {
    title.value = "公司战略";
    const res = await getCompanyIntroduce("公司战略");
    valueHtml.value = res.data;
  }
  if (id == 4) {
    title.value = "高层介绍";
    const res = await getCompanyIntroduce("公司高层");
    valueHtml.value = res.data;
  }
});

const state = reactive({
  dialogFormVisible: false,
});
// 暴露open方法
const open = () => {
  state.dialogFormVisible = true;
};
defineExpose({
  open,
});

// 取消订阅/监听
onBeforeUnmount(() => {
  bus.all.clear();
});
</script>
<template>
  <el-dialog
    v-model="state.dialogFormVisible"
    :title="title"
    width="600px"
    destroy-on-close
  >
    <div class="content" v-html="valueHtml"></div>
  </el-dialog>
</template>
<style scoped lang="scss">
.content {
  height: 600px;
  font-size: 18px;
}
</style>
