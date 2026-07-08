<script lang="ts" setup>
import bread_crumbs from "../../../components/publicComponents/bread_crumb.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Search } from "@element-plus/icons-vue";
import product_in_warehouse from "../../../components/product/product_in_warehouse.vue";
import apply from "../../../components/product/apply.vue";
import { bus } from "../../../utils/mitt";
import {
  searchProductForId,
  searchProductForApplyId,
  getProductLength,
  returnProductListData,
  returnApplyProductListData,
  getApplyProductLength,
} from "../../../api/product";
import deleteAdmin from "../../../components/userManage/deleteAdmin.vue";
import audit from "../../../components/product/audit.vue";
import withDraw from "../../../components/product/withDraw.vue";
import { useTable } from "../../../hooks/useTable";
const productData = useTable({
  fetchList: (page: number) => returnProductListData(page),
  getTotal: () => getProductLength(),
  searchMethod: (id: number) => searchProductForId(id),
});
const breadcrumbs = ref();
const item = ref({
  first: "产品管理",
  second: "入库管理",
});
// tab页
const activeName = ref("first");

// 产品列表

onMounted(() => {
  // 产品列表分页
  ProductMounted();
  // 申请产品列表分页
  ApplyProductMounted();
  console.log(productData.tableDatailData);
  console.log(productApplyData.tableDatailData);
});

// 新增入库
const InWarehouseRef = ref();
const addProductInWarehouse = () => {
  bus.emit("title", "新增入库");
  InWarehouseRef.value.open();
};
// 编辑产品信息
const editProductInWarehouse = (row: any) => {
  bus.emit("title", "编辑产品");
  bus.emit("edit", row);
  InWarehouseRef.value.open();
};
// 删除入库产品
const deleteProductRef = ref();
const deleteProductInWarehouse = (row: any) => {
  bus.emit("ident", "入库产品");
  bus.emit("deleteId", row);
  deleteProductRef.value.open();
};
// 删除成功时，更新组件
bus.on("refresh", () => {
  productData.currentChange(productData.pagination.currentPage);
  productData.fetchDataLength();
});
//  入库接受信号，更新父组件
bus.on("addProduct", () => {
  productData.currentChange(productData.pagination.currentPage);
  productData.fetchDataLength();
});
// 申请入库接受信号，更新父组件
bus.on("applyProduct", () => {
  productApplyData.currentChange(productData.pagination.currentPage);
  productApplyData.fetchDataLength();
});
// 申请出库
const applyRef = ref();
const applyOut = (row: any) => {
  // 传入申请出库的id
  bus.emit("applyId", row);
  // 传入title
  applyRef.value.open();
};

const ProductMounted = () => {
  productData.getFirstPageList();
  productData.fetchDataLength();
};

// 审核列表

// 引入审核列表
const productApplyData = useTable({
  fetchList: (page: number) => returnApplyProductListData(page),
  getTotal: () => getApplyProductLength(),
  searchMethod: (id: number) => searchProductForApplyId(id),
});

// 获取产品列表
const getProduct = async () => {
  productData.getFirstPageList();
};
// 打开审核弹窗
const auditRef = ref();

const auditProduct = (row: any) => {
  // 传入审核信息
  bus.emit("auditProduct", row);
  auditRef.value.open();
};

// 撤回申请
const withDrawRef = ref();
const withdrawProduct = (id: number) => {
  // 把id传送过去
  bus.emit("withDrawId", id);
  withDrawRef.value.open();
};
// 撤回申请成功，更新父组件
bus.on("withDrawSuccess", () => {
  // 更新产品列表第一页
  getProduct();
  productData.fetchDataLength();
  // 更新审核当前页
  productApplyData.currentChange(productApplyData.pagination.currentPage);
  productApplyData.fetchDataLength();
});

const ApplyProductMounted = () => {
  productApplyData.getFirstPageList();
  productApplyData.fetchDataLength();
};
// 销毁组件
onBeforeUnmount(() => {
  bus.all.clear();
});
</script>

<template>
  <bread_crumbs ref="breadcrumbs" :item="item"></bread_crumbs>
  <!-- wrapped -->
  <div class="module-common-wrapped">
    <div class="module-common-content">
      <el-tabs v-model="activeName">
        <el-tab-pane label="产品列表" name="first">
          <div class="pane-content">
            <div class="pane-top">
              <div class="module-common-header">
                <div class="search-wrapped">
                  <el-input
                    v-model="productData.searchAccount.value"
                    @change="productData.handleSearch"
                    size="large"
                    placeholder="请输入入库编号进行搜索"
                    :prefix-icon="Search"
                    clearable
                    @clear="productData.resetSearch"
                  ></el-input>
                </div>
                <div class="button-wrapped">
                  <el-button
                    type="primary"
                    size="large"
                    @click="addProductInWarehouse"
                    >新增入库</el-button
                  >
                </div>
              </div>
              <div class="module-common-table">
                <el-table
                  :data="productData.tableDatailData.value"
                  border
                  style="width: 100%"
                >
                  <el-table-column type="index" width="50" />
                  <el-table-column prop="product_id" label="入库编号" />
                  <el-table-column prop="product_name" label="产品名称" />
                  <el-table-column prop="product_category" label="产品类别" />
                  <el-table-column prop="product_unit" label="单位" />
                  <el-table-column
                    prop="product_in_warehouse_number"
                    label="入库数量"
                  />
                  <el-table-column
                    prop="product_single_price"
                    label="入库单价"
                  />
                  <el-table-column prop="product_all_price" label="入库总价" />
                  <el-table-column prop="product_status" label="库存状态">
                    <template #default="{ row }">
                      <el-tag
                        type="danger"
                        v-if="row.product_in_warehouse_number < 100"
                        >库存告急</el-tag
                      >
                      <el-tag
                        type="success"
                        v-if="
                          row.product_in_warehouse_number >= 100 &&
                          row.product_in_warehouse_number < 300
                        "
                        >库存正常</el-tag
                      ><el-tag
                        type="primary"
                        v-if="row.product_in_warehouse_number > 300"
                        >库存过剩</el-tag
                      >
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="product_create_person"
                    label="负责人"
                  />
                  <el-table-column
                    prop="product_create_time"
                    label="入库时间"
                    width="200"
                  >
                    <template #default="{ row }">
                      <div>{{ row.product_create_time?.slice(0, 10) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="product_update_time"
                    label="最后修改时间"
                    width="200"
                  >
                    <template #default="{ row }">
                      <div>{{ row.product_update_time?.slice(0, 10) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="in_memo" label="入库备注" />
                  <el-table-column label="操作" width="300" fixed="right">
                    <template #default="{ row }">
                      <el-button
                        type="primary"
                        @click="applyOut(row)"
                        :disabled="
                          row.product_out_status == '申请出库' ||
                          row.product_in_warehouse_number === 0
                        "
                        >申请出库</el-button
                      >
                      <el-button
                        type="success"
                        :disabled="row.product_out_status == '申请出库'"
                        @click="editProductInWarehouse(row)"
                        >编辑</el-button
                      >
                      <el-button
                        type="danger"
                        :disabled="row.product_out_status == '申请出库'"
                        @click="deleteProductInWarehouse(row)"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="table-footer">
              <!-- 分页 -->
              <el-pagination
                :pager-count="7"
                layout="prev, pager, next"
                :total="productData.pagination.total"
                :page-count="productData.pagination.pageCount"
                :current-page="productData.pagination.currentPage"
                @current-change="productData.currentChange($event)"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="审核列表" name="second">
          <div class="pane-content">
            <div class="pane-top">
              <div class="module-common-header">
                <div class="search-wrapped">
                  <el-input
                    v-model="productApplyData.searchAccount.value"
                    @change="productApplyData.handleSearch"
                    size="large"
                    placeholder="请输入申请出库编号进行搜索"
                    :prefix-icon="Search"
                    clearable
                    @clear="productApplyData.resetSearch"
                  ></el-input>
                </div>
              </div>
              <div class="module-common-table">
                <el-table
                  :data="productApplyData.tableDatailData.value"
                  border
                  style="width: 100%"
                >
                  <el-table-column type="index" width="50" />
                  <el-table-column prop="product_out_id" label="申请出库编号" />
                  <el-table-column prop="product_name" label="产品名称" />
                  <el-table-column prop="product_out_number" label="出库数量" />
                  <el-table-column prop="product_out_price" label="出库总价" />
                  <el-table-column
                    prop="product_out_apply_person"
                    label="申请人"
                  />
                  <el-table-column
                    prop="product_apply_time"
                    label="申请出库时间"
                    width="200"
                  >
                    <template #default="{ row }">
                      <div>{{ row.product_apply_time?.slice(0, 10) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="product_out_audit_person"
                    label="审核人"
                  />
                  <el-table-column
                    prop="product_audit_time"
                    label="审核时间"
                    width="200"
                  >
                    <template #default="{ row }">
                      <div>{{ row.product_audit_time?.slice(0, 10) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="product_out_status"
                    label="审核状态"
                    width="200"
                  >
                    <template #default="{ row }">
                      <el-tag
                        type="warning"
                        v-if="row.product_out_status == '申请出库'"
                        >申请出库</el-tag
                      >
                      <el-tag
                        type="success"
                        v-else-if="row.product_out_status == '申请出库'"
                        >同意</el-tag
                      >
                      <el-tag type="danger" v-else>否决</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="apply_memo"
                    label="申请出库备注"
                    width="200"
                  />

                  <el-table-column
                    prop="audit_memo"
                    label="审核备注"
                    width="200"
                  />

                  <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                      <el-button type="danger" @click="withdrawProduct(row.id)"
                        >撤回申请</el-button
                      >
                      <el-button type="primary" @click="auditProduct(row)"
                        >审核</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="table-footer">
              <!-- 分页 -->
              <el-pagination
                :pager-count="7"
                layout="prev, pager, next"
                :total="productApplyData.pagination.total"
                :page-count="productApplyData.pagination.pageCount"
                :current-page="productApplyData.pagination.currentPage"
                @current-change="productApplyData.currentChange($event)"
              />
            </div></div
        ></el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <product_in_warehouse ref="InWarehouseRef"></product_in_warehouse>
  <apply ref="applyRef" title="申请出库"></apply>
  <deleteAdmin ref="deleteProductRef"></deleteAdmin>
  <audit ref="auditRef"></audit>
  <withDraw ref="withDrawRef"></withDraw>
</template>

<style scoped lang="scss"></style>
