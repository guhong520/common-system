<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import bread_crumbs from "../../../components/publicComponents/bread_crumb.vue";
import { Search } from "@element-plus/icons-vue";
import {
  searchUser,
  searchUserByDepartment,
  banUser,
  hotUser,
  getBanList,
  getIdentityLength,
  returnListData,
} from "../../../api/userInfo";
import { getDepartment } from "../../../api/setting";
import userInfor from "../../../components/userManage/userInfor.vue";
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
  identity: "用户",
  fetchList: returnListData,
  getTotal: getIdentityLength,
  searchMethod: searchUser,
});
// 获取部门数据
const departmentList = ref();
const getdepartment = async () => {
  const res = await getDepartment();
  departmentList.value = res.data;
};
onMounted(() => {
  getdepartment();
  getAdmin();
});
const breadcrumbs = ref();
const item = ref({
  first: "用户管理",
  second: "用户",
});
const isLoading = ref(true);
// 获取管理员列表
const getAdmin = async () => {
  isLoading.value = true;
  currentChange(pagination.currentPage);
  fetchDataLength();
  isLoading.value = false;
};
// // 搜索用户
// const searchuser = async () => {
//   console.log(account.value, item.value.second);
//   await searchUser(account.value, item.value.second).then((res) => {
//     tableData.value = res.data;
//   });
//   if (account.value === "" && department.value === "") {
//     getAdmin();
//   }
// };
const department = ref<string>("");
// 搜索部门
const searchForDepartment = async () => {
  await searchUserByDepartment(department.value).then((res) => {
    tableDatailData.value = res.data;
  });
  if (department.value === "") {
    getAdmin();
  }
};
// 冻结用户
const banuser = async (id: number) => {
  await banUser(id).then((res) => {
    if (res.data.status === 0) {
      getFirstPageList();
    }
  });
};
// 解冻用户
const hotuser = async (id: number) => {
  await hotUser(id).then((res) => {
    if (res.data.status === 0) {
      getFirstPageList();
    }
  });
};
// 筛选冻结用户
const getBan = () => {
  pagination.currentPage = 1;
  getBanList().then((res) => {
    tableDatailData.value = res.data;
  });
};

// 打开用户具体信息弹窗
const userInforRef = ref();
const openUser = (row: any) => {
  // 传给userInfor组件的数据
  bus.emit("userId", row);
  userInforRef.value.open();
};
// 修改成功后，更新组件数据
bus.on("refresh", (id: any) => {
  if (id === 1) {
    getAdmin();
  }
  // 赋权与删除需要额外关闭弹窗
  if (id === 2) {
    getAdmin();
    userInforRef.value?.cancel();
  }
});
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
        <div class="search-left">
          <div class="search-wrapped">
            <el-input
              v-model="searchAccount"
              @change="handleSearch()"
              size="large"
              placeholder="请输入账号进行搜索"
              :prefix-icon="Search"
              clearable
              @clear="resetSearch"
            ></el-input>
          </div>
          <div class="select-wrapped">
            <el-select
              size="large"
              v-model="department"
              placeholder="请选择部门"
              @change="searchForDepartment()"
            >
              <el-option
                v-for="item in departmentList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </div>
        </div>
        <div class="button-wrapped">
          <el-button type="primary" size="large" plain @click="getBan"
            >筛选冻结用户</el-button
          >
          <el-button type="primary" size="large" plain @click="getFirstPageList"
            >显示全部用户</el-button
          >
        </div>
      </div>
      <!-- 表格内容 -->
      <div class="table-content">
        <el-table
          :data="tableDatailData"
          style="width: 100%"
          border
          v-if="!isLoading"
          @row-dblclick="openUser"
        >
          <el-table-column type="index" width="50" />
          <el-table-column prop="account" label="账号" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="sex" label="性别" />
          <el-table-column prop="identity" label="身份" />
          <el-table-column prop="department" label="部门" />
          <el-table-column prop="email" label="邮箱" width="200" />
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <div style="display: flex; align-items: center">
                <el-tag v-if="row.status === 1" type="danger" size="large"
                  >冻结</el-tag
                >
                <el-tag v-else type="success" size="large">正常</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="create_time" width="200">
            <template #default="{ row }">
              <div>{{ row.create_time?.slice(0, 10) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" prop="update_time" width="200">
            <template #default="{ row }">
              <div>{{ row.update_time?.slice(0, 10) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <div>
                <el-button
                  type="primary"
                  @click="banuser(row.id)"
                  :disabled="row.status === 1"
                  >冻结</el-button
                >
                <el-button
                  type="success"
                  @click="hotuser(row.id)"
                  :disabled="row.status === 0"
                  >解冻</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <template v-else>
          <el-empty description="数据加载中..."></el-empty>
        </template>
      </div>
    </div>
    <!-- 底部 -->
    <div class="table-footer">
      <el-pagination
        :page-size="20"
        :pager-count="7"
        layout="prev, pager, next"
        :total="pagination.total"
        :page-count="pagination.pageCount"
        :current-page="pagination.currentPage"
        @current-change="currentChange($event)"
      />
    </div>
  </div>
  <userInfor ref="userInforRef"></userInfor>
</template>
<style lang="scss" scoped>
.table-wrapped {
  padding: 5px;
  height: calc(100vh - 100px);
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .table-top {
    .table-header {
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 48px;
      background: #fff;
      .search-left {
        width: 60%;
        display: flex;
        .search-wrapped {
          margin-right: 20px;
          width: 45%;
        }
        .select-wrapped {
          width: 45%;
        }
      }
    }
    .table-content {
      min-height: 10px;
      padding: 10px 20px 20px;
      background: #fff;
    }
  }
  .table-footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
