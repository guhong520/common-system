<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from "vue";
import bread_crumbs from "../../../components/publicComponents/bread_crumb.vue";
import { bus } from "../../../utils/mitt";
import {
  returnRecycleListData,
  getRecycleMessageLength,
} from "../../../api/message";
import deleteAnnouncement from "../../../components/message/deleteAnnouncement.vue";
import { useTable } from "../../../hooks/useTable";

onMounted(() => {
  getRecycleList();
});

// 引入hooks
const {
  pagination,
  tableDatailData,
  currentChange,
  getFirstPageList,
  fetchDataLength,
} = useTable({
  fetchList: returnRecycleListData,
  getTotal: getRecycleMessageLength,
});

const item = ref({
  first: "消息管理",
  second: "回收站",
});
// 获取回收站列表
const getRecycleList = async () => {
  getFirstPageList();
  fetchDataLength();
};
// 还原
const deleteAnnouncementRef = ref();
const renew = (row: any) => {
  bus.emit("delAnnounceOrSystem", "还原消息");
  bus.emit("delFirstAnnouncement", row);
  deleteAnnouncementRef.value.open();
};
// 删除
const realDelete = (row: any) => {
  bus.emit("delFirstAnnouncement", row);
  bus.emit("delAnnounceOrSystem", "永久删除");
  deleteAnnouncementRef.value.open();
};
// 更新父组件
bus.on("refreshAnnouncement", (id: any) => {
  if (id == 3 || id == 4) {
    getRecycleList();
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
      <div class="table-content">
        <el-table :data="tableDatailData" border style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column prop="message_title" label="消息主题" />
          <el-table-column prop="message_category" label="消息类别" />
          <el-table-column prop="message_publish_department" label="发布部门" />
          <el-table-column prop="message_receipt_object" label="接受对象" />
          <el-table-column
            prop="message_delete_time"
            label="删除日期"
            width="200"
          >
            <template #default="{ row }">
              <div>{{ row.message_delete_time?.slice(0, 16) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300" fixed="right">
            <template #default="{ row }">
              <el-button type="success" @click="renew(row)">还原</el-button>
              <el-button type="danger" @click="realDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
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
  <deleteAnnouncement ref="deleteAnnouncementRef"></deleteAnnouncement>
</template>

<style scoped lang="scss"></style>
