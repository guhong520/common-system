<!-- 申请出库 -->
<script lang="ts" setup>
import { ref, reactive } from "vue";
import { type productData } from "../../types/product";

import { applyOutProduct } from "../../api/product";
const dialogVisible = ref(false);
const title = ref();
const open = () => {
  dialogVisible.value = true;
};
defineExpose({
  open,
});
const ruleFormRef = ref();
const labelPosition = ref("left");
import { bus } from "../../utils/mitt";
const ruleForm: productData = reactive({
  id: 0,
  product_out_id: 0,
  product_name: "",
  product_out_number: 0,
  product_in_warehouse_number: 0,
  product_single_price: 0,
  product_out_apply_person: "",
  apply_memo: "",
});
const validatePass = (value: any, callback: any) => {
  if (ruleForm.product_in_warehouse_number) {
    if (value > ruleForm.product_in_warehouse_number) {
      callback(new Error("申请数量不能大于库存数量"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};
const rules = reactive({
  product_out_id: [
    { required: true, message: "请输入出库编号", trigger: "blur" },
  ],
  product_out_number: [
    { required: true, message: "请输入申请产品出库数量", trigger: "blur" },
    { validator: validatePass, trigger: "blur" },
  ],
  product_out_apply_person: [
    { required: true, message: "请输入申请人", trigger: "blur" },
  ],
  apply_memo: [{ message: "请输入申请备注", trigger: "blur" }],
});

// 申请出库;
// 接受传过来的id
bus.on("applyId", (row: any) => {
  ruleForm.id = row.id;
  ruleForm.product_out_id = row.product_id;
  ruleForm.product_in_warehouse_number = row.product_in_warehouse_number;
  ruleForm.product_name = row.product_name;
  ruleForm.product_single_price = row.product_single_price;
});
const applyProduct = async () => {
  const res = await applyOutProduct(ruleForm);
  if (res.data.status === 0) {
    bus.emit("applyProduct", 1);
  }
  dialogVisible.value = false;
};
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="600"
    draggable="true"
  >
    <div class="product-name">
      您申请出库的产品是:&nbsp;&nbsp;{{ ruleForm.product_name }}
      <span
        >该产品的库存还有:&nbsp;&nbsp;{{
          ruleForm.product_in_warehouse_number
        }}</span
      >
    </div>
    <div class="dialog-content">
      <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        status-icon
        :label-position="labelPosition"
      >
        <el-form-item label="出库编号" prop="product_out_id">
          <el-input v-model="ruleForm.product_out_id" disabled />
        </el-form-item>
        <el-form-item label="出库数量" prop="product_out_number">
          <el-input v-model="ruleForm.product_out_number" />
        </el-form-item>
        <el-form-item label="产品单价" prop="product_single_price">
          <el-input disabled v-model="ruleForm.product_single_price" />
        </el-form-item>
        <el-form-item label="出库申请人" prop="product_out_apply_person">
          <el-input v-model="ruleForm.product_out_apply_person" />
        </el-form-item>
        <el-form-item label="申请备注" prop="apply_memo">
          <el-input v-model="ruleForm.apply_memo" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="applyProduct"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.dialog-content {
  padding: 15px 30px;
}
:deep(.el-form-item) {
  margin: 30px;
}
.product-name {
  display: flex;
  flex-direction: column;
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  span {
    margin-top: 10px;
  }
}
</style>
