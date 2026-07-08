<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from "vue";
import bread_crumbs from "../../../components/publicComponents/bread_crumb.vue";
import { bus } from "../../../utils/mitt";
import type { UploadProps, UploadUserFile } from "element-plus";
import { ElMessage } from "element-plus";
import {
  bindFileAndUser,
  returnFilesListData,
  fileListLength,
  updateDownload,
} from "../../../api/file";
import tipes from "../../../components/publicComponents/tips.vue";
import { useTable } from "../../../hooks/useTable";

onMounted(() => {
  getFileList();
});

// 引入hooks
const {
  pagination,
  tableDatailData,
  currentChange,
  getFirstPageList,
  fetchDataLength,
} = useTable({
  fetchList: returnFilesListData,
  getTotal: fileListLength,
});

// 获取文件列表
const getFileList = async () => {
  getFirstPageList();
  fetchDataLength();
};
const name = localStorage.getItem("name") as unknown as string;
const item = ref({
  first: "合同管理",
});

// 上传文件
const fileList = ref<UploadUserFile[]>([]);

// 当上传文件成功
const handleSuccess = (response: any) => {
  if (response.status === 0) {
    // 自调用函数
    (() => {
      bindFileAndUser(name, response.url).then((res) => {
        if (res) {
          // 调用函数
          getFileList();
        }
      });
    })();

    // 清空文件列表
    fileList.value = [];
    ElMessage.success("上传成功");
  } else {
    ElMessage.error("上传失败,请检查文件是否重复或者网络连接问题");
  }
};
// 当文件超出限制
const handleExceed: UploadProps["onExceed"] = (files) => {
  ElMessage.warning(`当前限制上传 3 个文件，本次上传了 ${files.length} 个文件`);
};

const tipsRef = ref();
//  下载文件
const changeClick = async (row: any) => {
  const res = await updateDownload(row.download_number, row.id);
  if (res.data.status === 0) {
    ElMessage({
      message: "下载成功",
      type: "success",
    });
    // 通知更新数据
    fetchDataLength();
    currentChange(pagination.currentPage);
  } else {
    ElMessage({
      message: "下载失败",
      type: "error",
    });
  }
};
//  删除文件
const deleteContractFile = (row: any) => {
  bus.emit("tipsTitle", "删除文件");
  bus.emit("tipsBody", row);
  tipsRef.value.open();
};
// 更新父组件
bus.on("deleteFile", (id: any) => {
  if (id === 1) {
    currentChange(pagination.currentPage);
    fetchDataLength();
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
        <div></div>
        <div class="upload_wrapped">
          <el-upload
            :multiple="true"
            :limit="3"
            :show-file-list="false"
            v-model:file-list="fileList"
            class="upload-demo"
            action="http://ghong.asia/file/uploadFile"
            :on-success="handleSuccess"
            :on-exceed="handleExceed"
          >
            <el-button type="primary">上传文件</el-button>
          </el-upload>
        </div>
      </div>
      <div class="table-content">
        <el-table :data="tableDatailData" border style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column prop="file_name" label="合同名" width="350" />

          <el-table-column prop="file_size" label="合同文件大小" width="100">
            <template #default="{ row }">
              <div>{{ row.file_size?.slice(0, 6) }} KB</div>
            </template>
          </el-table-column>
          <el-table-column prop="upload_person" label="上传用户" width="150" />
          <el-table-column prop="download_number" label="下载数" />
          <el-table-column prop="upload_time" label="上传时间" width="200">
            <template #default="{ row }">
              <div>{{ row.upload_time?.slice(0, 16) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300" fixed="right">
            <template #default="{ row }">
              <el-button type="success">
                <template #default>
                  <a :href="row.file_url" @click="changeClick(row)">下载文件</a>
                </template>
              </el-button>
              <el-button type="danger" @click="deleteContractFile(row)"
                >删除文件</el-button
              >
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
a {
  text-decoration: none;
  color: #fff;
}
</style>
