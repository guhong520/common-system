<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, defineProps } from "vue";
import bread_crumbs from "../../components/publicComponents/bread_crumb.vue";
import { Search } from "@element-plus/icons-vue";
import createAdmin from "../../components/userManage/createAdmin.vue";
import editAdmin from "../../components/userManage/editAdmin.vue";
import deleteAdmin from "../../components/userManage/deleteAdmin.vue";
import { bus } from "../../utils/mitt";
import { useTable } from "../../hooks/useTable";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  identity: {
    type: String,
    required: true,
  },
  fetchList: {
    type: Function,
    required: true,
  },
  getTotal: {
    type: Function,
    required: true,
  },
  searchMethod: {
    type: Function,
    required: true,
  },
  createTitle: {
    type: String,
    required: true,
  },
  createButtonText: {
    type: String,
    required: true,
  },
});

const breadcrumbs = ref();
// 控制管理员弹窗
const Create = ref();
const openDialog = () => {
  bus.emit("manageTitle", props.createTitle);
  Create.value.open();
};
const Edit = ref();
// 编辑
const openDialog1 = (id: number) => {
  // 传给编辑组件的数据
  bus.emit("editId", id);
  bus.emit("ident", props.item.second);
  Edit.value.open();
};
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
  identity: props.identity,
  fetchList: props.fetchList,
  getTotal: props.getTotal,
  searchMethod: props.searchMethod,
});
// 获取管理员列表
const getAdmin = async () => {
  currentChange(pagination.currentPage);
  fetchDataLength();
};

onMounted(() => {
  getFirstPageList();
  fetchDataLength();
});
const Delete = ref();
const openDelete = (row: any) => {
  // 传给删除组件的数据
  bus.emit("deleteId", row);
  bus.emit("ident", props.item.second);
  Delete.value.open();
};

// 修改成功后，更新组件数据
bus.on("refresh", (id: any) => {
  if (id === 1 || id === 2) {
    getAdmin();
  }
});
// 销毁组件
onBeforeUnmount(() => {
  bus.all.clear();
});
</script>

<template>
  <bread_crumbs ref="breadcrumbs" :item="item"></bread_crumbs>
  <div class="table-wrapped">
    <!-- 顶部 -->
    <div class="table-top">
      <!-- 表格顶部 -->
      <div class="table-header">
        <!-- 搜索框 -->
        <div class="search-wrapped">
          <el-input
            v-model="searchAccount"
            @change="handleSearch"
            size="large"
            placeholder="请输入账号进行搜索"
            :prefix-icon="Search"
            clearable
            @clear="resetSearch"
          ></el-input>
        </div>
        <div class="button-wrapped">
          <el-button type="primary" @click="openDialog">{{
            createButtonText
          }}</el-button>
        </div>
      </div>
      <!-- 表格内容 -->
      <div class="table-content">
        <el-table :data="tableDatailData" style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column prop="account" label="账号" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="department" label="部门" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <div>
                <el-button type="success" @click="openDialog1(row.id)"
                  >编辑</el-button
                >
                <el-button type="danger" @click="openDelete(row)"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 底部 -->
    <div class="table-footer">
      <el-pagination
        :pager-count="7"
        layout="prev, pager, next"
        :total="pagination.total"
        :page-count="pagination.pageCount"
        :current-page="pagination.currentPage"
        @current-change="currentChange($event)"
      />
    </div>
  </div>
  <createAdmin
    ref="Create"
    :title="createTitle"
    @success="getAdmin"
  ></createAdmin>
  <editAdmin ref="Edit"></editAdmin>
  <deleteAdmin ref="Delete"></deleteAdmin>
</template>

<style lang="scss" scoped></style>
