<script setup lang="ts">
const props = defineProps(["item"]);
import svgIcon from "../../components/publicComponents/svgIcon.vue";
</script>

<template>
  <div class="bread-crumb">
    <svgIcon icon-name="location" class="bread-crumb-icon"></svgIcon>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>{{ props.item.first }}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="props.item.second">{{
        props.item.second
      }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<style scoped lang="scss">
.bread-crumb {
  height: 30px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  .bread-crumb-icon {
    margin-right: 4px;
  }
}
:deep(.el-breadcrumb__inner) {
  height: 30px;
  font-size: 14px;
  line-height: 30px;
}
:deep(.el-breadcrumb__inner) {
  font-weight: 500;
}
</style>
