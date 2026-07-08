<script lang="ts" setup>
import bread_crumbs from "../../../components/publicComponents/bread_crumb.vue";
import { Search } from "@element-plus/icons-vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import {
  searchProductForOutId,
  returnOutProductListData,
  getOutProductLength,
} from "../../../api/product";
import { bus } from "../../../utils/mitt";
import { useTable } from "../../../hooks/useTable";
// 引入hooks
const {
  pagination,
  tableDatailData,
  searchAccount,
  currentChange,
  getFirstPageList,
  fetchDataLength,
  handleSearch,
  resetSearch,
} = useTable({
  fetchList: returnOutProductListData,
  getTotal: getOutProductLength,
  searchMethod: searchProductForOutId,
});

const breadcrumbs = ref();
const item = ref({
  first: "产品管理",
  second: "出库管理",
});
// 入库接受信号，更新父组件
bus.on("auitSuccess", () => {
  currentChange(pagination.currentPage);
});
onMounted(() => {
  // getProductList();
  fetchDataLength();
  getFirstPageList();
});

onBeforeUnmount(() => {
  bus.all.clear();
});
</script>

<template>
  <bread_crumbs ref="breadcrumbs" :item="item"></bread_crumbs>
  <!-- wrapped -->
  <div class="module-common-wrapped">
    <div class="module-common-content">
      <div class="table-wrapped">
        <div class="table-top">
          <div class="table-header">
            <div class="search-wrapped">
              <el-input
                v-model="searchAccount"
                @change="handleSearch"
                size="large"
                placeholder="请输入出库编号进行搜索"
                :prefix-icon="Search"
                clearable
                @clear="resetSearch"
              ></el-input>
            </div>
          </div>
          <div class="table-content">
            <el-table :data="tableDatailData" border style="width: 100%">
              <el-table-column type="index" width="50" />
              <el-table-column prop="product_out_id" label="出库入库" />
              <el-table-column prop="product_out_number" label="出库数量" />
              <el-table-column prop="product_out_price" label="出库总价" />
              <el-table-column
                prop="product_out_apply_person"
                label="出库申请人"
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
              <el-table-column prop="product_out_audit_person" label="审核人" />
              <el-table-column
                prop="product_audit_time"
                label="审核时间"
                width="200"
              >
                <template #default="{ row }">
                  <div>{{ row.product_audit_time?.slice(0, 10) }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="audit_memo" label="审核备注" />
            </el-table>
          </div>
        </div>
      </div>
      <div class="table-footer">
        <!-- 分页 -->
        <el-pagination
          :page-size="3"
          layout="prev, pager, next"
          :total="pagination.total"
          :page-count="pagination.pageCount"
          :current-page="pagination.currentPage"
          @current-change="currentChange($event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-wrapped {
  width: 30%;
}
.table-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
