<!-- 编辑和新增产品入库组件 -->

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { type productData } from "../../types/product";
import { createProduct, editProduct } from "../../api/product";
import { getProduct } from "../../api/setting";
const dialogVisible = ref(false);
const title = ref();
// 判断是否是编辑
const isEdit = ref(false);
// 重置表单数据的方法
const resetForm = () => {
  Object.assign(ruleForm, {
    id: 0,
    product_id: null,
    product_name: "",
    product_category: "",
    product_unit: "",
    product_in_warehouse_number: null,
    product_single_price: null,
    product_create_person: "",
    in_memo: "",
  });
};
// 接受传过来的title
bus.on("title", (title1: any) => {
  title.value = title1;
  if (title1 == "新增入库") {
    isEdit.value = false;
    resetForm();
  } else {
    isEdit.value = true;
    bus.on("edit", (row: any) => {
      ruleForm.id = row.id;
      ruleForm.product_id = row.product_id;
      ruleForm.product_name = row.product_name;
      ruleForm.product_category = row.product_category;
      ruleForm.product_unit = row.product_unit;
      ruleForm.product_in_warehouse_number = row.product_in_warehouse_number;
      ruleForm.product_single_price = row.product_single_price;
      ruleForm.product_create_person = row.product_create_person;
    });
  }
});

const open = () => {
  dialogVisible.value = true;
};
defineExpose({
  open,
});
// 获取产品列表
const productData = ref([]);
const getProductList = async () => {
  const res = await getProduct();
  productData.value = res.data;
};
onMounted(() => {
  getProductList();
});
const ruleFormRef = ref();
const labelPosition = ref("left");
import { bus } from "../../utils/mitt";
const ruleForm: productData = reactive({
  id: 0,
  product_id: 0,
  product_name: "",
  product_category: "",
  product_unit: "",
  product_in_warehouse_number: 0,
  product_single_price: 0,
  product_create_person: "",
  in_memo: "",
});
const rules = reactive({
  product_id: [{ required: true, message: "请输入入库编号", trigger: "blur" }],
  product_name: [
    { required: true, message: "请输入产品名称", trigger: "blur" },
  ],
  product_category: [
    { required: true, message: "请选择产品类别", trigger: "change" },
  ],
  product_unit: [
    { required: true, message: "请选择产品单位", trigger: "change" },
  ],
  product_in_warehouse_number: [
    { required: true, message: "请输入产品入库数量", trigger: "blur" },
  ],
  product_single_price: [
    { required: true, message: "请输入产品入库单价", trigger: "blur" },
  ],
  product_create_person: [
    { required: true, message: "请输入入库操作人", trigger: "blur" },
  ],
  in_memo: [{ message: "请输入入库备注", trigger: "blur" }],
});

// 新建入库;
const addProduct = async () => {
  const res = await createProduct(ruleForm);
  if (res.data.status === 0) {
    bus.emit("addProduct", 1);
  }
  dialogVisible.value = false;
};
// 编辑入库产品
const editproduct = async () => {
  const res = await editProduct(ruleForm);
  if (res.data.status === 0) {
    bus.emit("addProduct", 1);
  }
  dialogVisible.value = false;
};
const handleSubmit = () => {
  if (isEdit.value) {
    editproduct();
  } else {
    addProduct();
  }
};
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="600"
    draggable="true"
  >
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
        <el-form-item label="入库编号" prop="product_id">
          <el-input :disabled="isEdit" v-model="ruleForm.product_id" />
        </el-form-item>
        <el-form-item label="产品名称" prop="product_name">
          <el-input v-model="ruleForm.product_name" />
        </el-form-item>
        <el-form-item label="产品类别" prop="product_category">
          <el-select
            v-model="ruleForm.product_category"
            placeholder="请产品类别"
          >
            <el-option
              v-for="item in productData"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产品单位" prop="product_unit">
          <el-select v-model="ruleForm.product_unit" placeholder="请产品单位">
            <el-option label="个" value="个" />
            <el-option label="件" value="件" />
            <el-option label="斤" value="斤" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品入库数量" prop="product_in_warehouse_number">
          <el-input v-model="ruleForm.product_in_warehouse_number" />
        </el-form-item>
        <el-form-item label="产品入库单价" prop="product_single_price">
          <el-input v-model="ruleForm.product_single_price" />
        </el-form-item>
        <el-form-item label="入库操作人" prop="product_create_person">
          <el-input
            :disabled="isEdit"
            v-model="ruleForm.product_create_person"
          />
        </el-form-item>
        <el-form-item label="入库备注" prop="in_memo">
          <el-input v-model="ruleForm.in_memo" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.dialog-content {
  padding: 20px 30px;
}
:deep(.el-form-item) {
  margin: 30px;
}
</style>
