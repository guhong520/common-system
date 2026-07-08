<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from "vue";
import bread_crumbs from "../../../components/publicComponents/bread_crumb.vue";
import { bus } from "../../../utils/mitt";
import tipes from "../../../components/publicComponents/tips.vue";
import { Search } from "@element-plus/icons-vue";
import {
  searchLoginLogList,
  returnLoginListData,
  loginLogListLength,
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
  fetchList: returnLoginListData,
  getTotal: loginLogListLength,
  searchMethod: searchLoginLogList,
});

const item = ref({
  first: "登录日志",
});

const getLogList = () => {
  fetchDataLength();
  getFirstPageList();
};

// tipes组件
const tipsRef = ref();
const clearLogin = () => {
  bus.emit("tipsTitle", "清除登录日志");
  tipsRef.value.open();
};
// 更新父组件
bus.on("deleteFile", (id: any) => {
  if (id === 3) {
    getLogList();
  }
});

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
            placeholder="请输入账号进行搜索"
            :prefix-icon="Search"
            clearable
            @clear="resetSearch()"
          ></el-input>
        </div>
        <div class="button-wrapped">
          <el-button type="danger" @click="clearLogin">清空登录日志</el-button>
        </div>
      </div>
      <div class="table-content">
        <el-table :data="tableDatailData" border style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column prop="account" label="账号" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="login_time" label="登录时间" width="200">
            <template #default="{ row }">
              <div>{{ row.login_time?.slice(0, 16) }}</div>
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

<style scoped lang="scss"></style>
