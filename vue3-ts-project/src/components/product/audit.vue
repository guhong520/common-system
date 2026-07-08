<!-- 审核产品 -->
<script lang="ts" setup>
import { ref, onBeforeUnmount, reactive } from "vue";
import { bus } from "../../utils/mitt";
import { type productOutData } from "../../types/productOut";
import { useUserInfo } from "../../store/userInfo";
import { auditProduct } from "../../api/product";

const dialogVisible = ref(false);
const open = () => {
  dialogVisible.value = true;
};
defineExpose({
  open,
});
const useStore = useUserInfo();

const formData: productOutData = reactive({
  id: 0,
  product_out_id: 0,
  product_out_status: "同意",
  audit_memo: "",
  product_out_price: 0,
  product_out_audit_person: useStore.name,
  product_out_apply_person: "",
  product_in_warehouse_number: 0,
  product_single_price: 0,
  product_out_number: 0,
  product_apply_time: "",
});
// 接受穿过的信息
bus.on("auditProduct", (row: any) => {
  formData.id = row.id;
  formData.product_out_id = row.product_out_id;
  formData.product_out_price = row.product_out_price;
  formData.product_out_apply_person = row.product_out_apply_person;
  formData.product_in_warehouse_number = row.product_in_warehouse_number;
  formData.product_single_price = row.product_single_price;
  formData.product_out_number = row.product_out_number;
  formData.product_apply_time = row.product_apply_time;
});
// 通知父组件刷新
// 审核产品
const auditproduct = async () => {
  const res = await auditProduct(formData);
  if (res && res.data.status === 0) {
    // 通知父组件更新数据(入库列表)
    bus.emit("auitSuccess", 1);
    bus.emit("addProduct", 1);
    // 通知出库列表更新
    bus.emit("applyProduct", 1);
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
    title="审核产品"
    width="600"
    center
    draggable="true"
  >
    <div class="auit-content">
      <span>确定审核此产品的出库吗？</span>
      <el-radio-group v-model="formData.product_out_status">
        <el-radio value="同意">同意</el-radio>
        <el-radio value="否决">否决</el-radio>
      </el-radio-group>
      <el-input
        type="textarea"
        placeholder="请输入审核备注"
        v-model="formData.audit_memo"
        rows="2"
      ></el-input>
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="auditproduct">确 定</el-button>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.auit-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  span {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
  }
  :deep(.el-textarea__inner) {
    width: 80%;
    margin: 10px auto 20px;
  }
}
.table-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
