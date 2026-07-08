<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from "vue";
import bread_crumbs from "../../../components/publicComponents/bread_crumb.vue";
import { bus } from "../../../utils/mitt";
import tipes from "../../../components/publicComponents/tips.vue";
import { Search } from "@element-plus/icons-vue";
import {
  searchOperationLogList,
  returnOperationListData,
  operationLogListLength,
} from "../../../api/log";
import { useTable } from "../../../hooks/useTable";

onMounted(() => {
  getLogList();
});

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
  fetchList: returnOperationListData,
  getTotal: operationLogListLength,
  searchMethod: searchOperationLogList,
});

const item = ref({
  first: "操作日志",
});

const getLogList = () => {
  fetchDataLength();
  getFirstPageList();
};

// tipes组件
const tipsRef = ref();
const clearOperation = () => {
  bus.emit("tipsTitle", "清除操作日志");
  tipsRef.value.open();
};
// 更新父组件
bus.on("deleteFile", (id: any) => {
  if (id === 2) {
    getLogList();
  }
});

// 判断等级标签
const level = (level: string) => {
  if (level == "高级") {
    return "danger";
  }
  if (level == "中级") {
    return "warning";
  }
  if (level == "低级") {
    return "primary";
  }
};
onBeforeUnmount(() => {
  bus.all.clear();
});
</script>
<template>
  <bread_crumbs :item="item"></bread_crumbs>
  <div class="table-wrapped">
    <div class="table-top">
      <div class="table-header">
        <div class="search-wrapped">
          <el-input
            v-model="searchAccount"
            @change="handleSearch()"
            size="large"
            placeholder="请输入操作者进行搜索"
            :prefix-icon="Search"
            clearable
            @clear="resetSearch()"
          ></el-input>
        </div>
        <div class="button-wrapped">
          <el-button type="danger" @click="clearOperation"
            >清空操作日志</el-button
          >
        </div>
      </div>
      <div class="table-content">
        <el-table :data="tableDatailData" border style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column prop="operation_person" label="操作者">
            <template #default="{ row }">
              <div :class="level(row.operation_level)">
                {{ row.operation_person }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="operation_content" label="操作内容" />
          <el-table-column prop="operation_level" label="操作等级">
            <template #default="{ row }">
              <el-tag :type="level(row.operation_level)">{{
                row.operation_level
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="operation_time" label="操作时间" width="200">
            <template #default="{ row }">
              <div>{{ row.operation_time?.slice(0, 16) }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="table-footer">
      <!-- 分页 -->
      <el-pagination
        :page-size="10"
        layout="prev, pager, next"
        :total="pagination.total"
        :page-count="pagination.pageCount"
        :current-page="pagination.currentPage"
        @current-change="currentChange($event)"
      />
    </div>
  </div>
  <tipes ref="tipsRef"></tipes>
</template>

<style scoped lang="scss">
.danger {
  border-left: 2px solid red;
}
.warning {
  border-left: 2px solid yellow;
}
</style>
