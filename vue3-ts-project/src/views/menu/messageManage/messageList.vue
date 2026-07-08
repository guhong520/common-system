<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import bread_crumbs from "../../../components/publicComponents/bread_crumb.vue";
import createAnnouncement from "../../../components/message/createAnnouncement.vue";
import {
  searchMessageBydepartment,
  searchMessageByLevel,
  getCompanyMessageLength,
  getSystemMessageLength,
  returnCompanyListData,
  returnSystemListData,
} from "../../../api/message";
import deleteAnnouncement from "../../../components/message/deleteAnnouncement.vue";
import { bus } from "../../../utils/mitt";
import { getDepartment } from "../../../api/setting";
import { useTable } from "../../../hooks/useTable";

// companyData.tableDatailData 是嵌套在对象里的 ref，不会自动解包，需要手动加上 .value 来访问实际值。而直接在模板里使用 ref 创建的变量时，Vue 3 会自动解包，不用写 .value，做table数据的问题

// 拿到hooks分页数据
const companyData = useTable({
  fetchList: returnCompanyListData,
  getTotal: getCompanyMessageLength,
});
// 系统消息
const systemData = useTable({
  fetchList: returnSystemListData,
  getTotal: getSystemMessageLength,
});
// tab页
const activeName = ref("first");
const item = ref({
  first: "消息管理",
  second: "消息列表",
});
// 获取部门
const departmentList = ref();
const getdepartment = async () => {
  const res = await getDepartment();
  departmentList.value = res.data;
};
// 公告管理
onMounted(() => {
  // 公司公告获取初始消息
  companyData.getFirstPageList();
  companyData.fetchDataLength();
  // 系统消息
  systemData.getFirstPageList();
  systemData.fetchDataLength();
  getdepartment();
});
// 获取公告列表
const getAnnouncementList = async () => {
  // 搜索项置为空
  Department.value = "";
  radio.value = "";
  companyData.getFirstPageList();
  companyData.fetchDataLength();
};

// 根据发布部门进行搜索
const Department = ref();

const getListByDepartment = async () => {
  radio.value = "";
  companyData.pagination.currentPage = 1;
  const res = await searchMessageBydepartment(Department.value);
  companyData.tableDatailData.value = res.data;
};
// 重要等级
const radio = ref("");
// 创建公告
const createAnnouncementRef = ref();
const createAnnouncemMent = () => {
  bus.emit("announcement", "发布公告");
  createAnnouncementRef.value.open();
};
//编辑公告
const editAnnouncemMent = (row: any) => {
  bus.emit("announcement", "编辑公告");
  bus.emit("editAnnouncement", row);
  createAnnouncementRef.value.open();
};
// 删除公告
const deleteAnnouncementRef = ref();
const deleteAnnouncemMent = (row: any) => {
  bus.emit("delAnnounceOrSystem", "删除公司公告");
  bus.emit("delFirstAnnouncement", row);
  deleteAnnouncementRef.value.open();
};
// 根据等级搜索公告
const getMessageByLevel = async () => {
  Department.value = "";
  companyData.pagination.currentPage = 1;
  const res = await searchMessageByLevel(radio.value);
  companyData.tableDatailData.value = res.data;
};
// 更父组件,id为一就是公司公告，2就是系统消息
bus.on("refreshAnnouncement", (id: any) => {
  if (id === 1) {
    companyData.currentChange(companyData.pagination.currentPage);
    companyData.fetchDataLength();
  }
  if (id === 2) {
    systemData.currentChange(systemData.pagination.currentPage);
    systemData.fetchDataLength();
  }
  if (id === 4) {
    companyData.fetchDataLength();
    systemData.fetchDataLength();
  }
});

// 系统消息

// 发布系统消息
const createSystemMessage = () => {
  bus.emit("announcement", "发布系统消息");
  createAnnouncementRef.value.open();
};
// 编辑系统消息
const editSystemMessage = (row: any) => {
  bus.emit("announcement", "编辑系统消息");
  bus.emit("editAnnouncement", row);
  createAnnouncementRef.value.open();
};
// 删除系统消息
const deletleSystemMessage = (row: any) => {
  bus.emit("delAnnounceOrSystem", "删除系统消息");
  bus.emit("delFirstAnnouncement", row);
  deleteAnnouncementRef.value.open();
};

onBeforeUnmount(() => {
  bus.all.clear();
});
</script>
<template>
  <bread_crumbs :item="item"></bread_crumbs>
  <!-- wrapped -->
  <div class="module-common-wrapped">
    <div class="module-common-content">
      <el-tabs v-model="activeName">
        <el-tab-pane label="公告管理" name="first">
          <div class="pane-content">
            <div class="pane-top">
              <div class="module-common-header">
                <div class="search-wrapped">
                  <div>
                    <el-select
                      v-model="Department"
                      placeholder="请选择发布部门"
                      @change="getListByDepartment"
                    >
                      <el-option
                        v-for="item in departmentList"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </div>
                  <div>
                    <el-radio-group v-model="radio" @change="getMessageByLevel">
                      <el-radio value="一般">一般</el-radio>
                      <el-radio value="重要">重要</el-radio>
                      <el-radio value="必要">必要</el-radio>
                    </el-radio-group>
                  </div>
                </div>
                <div class="button-wrapped">
                  <el-button plain type="primary" @click="getAnnouncementList"
                    >全部公告</el-button
                  >
                  <el-button type="primary" @click="createAnnouncemMent"
                    >发布公告</el-button
                  >
                </div>
              </div>
              <div class="module-common-table">
                <el-table
                  :data="companyData.tableDatailData.value"
                  border
                  style="width: 100%"
                >
                  <el-table-column type="index" width="50" />
                  <el-table-column
                    prop="message_category"
                    label="类别"
                    width="100"
                  />
                  <el-table-column
                    prop="message_publish_department"
                    label="消息发布部门"
                    width="120"
                  />
                  <el-table-column
                    prop="message_publish_name"
                    label="消息发布者"
                    width="150"
                  />
                  <el-table-column
                    prop="message_receipt_object"
                    label="消息接受对象"
                    width="120"
                  />
                  <el-table-column
                    prop="message_level"
                    label="公告等级"
                    width="100"
                  />
                  <el-table-column
                    prop="message_publish_time"
                    label="消息发布时间"
                    width="200"
                  >
                    <template #default="{ row }">
                      <div>{{ row.message_publish_time?.slice(0, 10) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="message_update_time"
                    label="最新更新时间"
                    width="200"
                  >
                    <template #default="{ row }">
                      <div>{{ row.message_update_time?.slice(0, 10) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="message_click_number"
                    label="阅读人数"
                  />
                  <el-table-column label="操作" width="300" fixed="right">
                    <template #default="{ row }">
                      <el-button type="success" @click="editAnnouncemMent(row)"
                        >编辑</el-button
                      >
                      <el-button type="danger" @click="deleteAnnouncemMent(row)"
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
                :page-size="3"
                layout="prev, pager, next"
                :total="companyData.pagination.total"
                :page-count="companyData.pagination.pageCount"
                :current-page="companyData.pagination.currentPage"
                @current-change="companyData.currentChange($event)"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="系统消息" name="second">
          <div class="pane-content">
            <div class="pane-top">
              <div class="module-common-header">
                <div class="search-wrapped"></div>
                <div class="button-wrapped">
                  <el-button type="primary" @click="createSystemMessage()"
                    >发布系统消息</el-button
                  >
                </div>
              </div>
              <div class="module-common-table">
                <el-table
                  :data="systemData.tableDatailData.value"
                  border
                  style="width: 100%"
                >
                  <el-table-column type="index" width="50" />
                  <el-table-column prop="message_title" label="消息主题" />
                  <el-table-column prop="message_publish_name" label="发布者" />
                  <el-table-column
                    prop="message_click_number"
                    label="阅读人数"
                  />

                  <el-table-column
                    prop="message_publish_time"
                    label="发布时间"
                    width="200"
                  >
                    <template #default="{ row }">
                      <div>{{ row.message_publish_time?.slice(0, 10) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                      <el-button type="success" @click="editSystemMessage(row)"
                        >编辑</el-button
                      >
                      <el-button
                        type="danger"
                        @click="deletleSystemMessage(row)"
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
                :page-size="3"
                layout="prev, pager, next"
                :total="systemData.pagination.total"
                :page-count="systemData.pagination.pageCount"
                :current-page="systemData.pagination.currentPage"
                @current-change="systemData.currentChange($event)"
              />
            </div></div
        ></el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <createAnnouncement ref="createAnnouncementRef"></createAnnouncement>
  <deleteAnnouncement ref="deleteAnnouncementRef"></deleteAnnouncement>
</template>

<style scoped lang="scss">
.el-radio-group {
  display: flex;
  margin-left: 20px;
}
:deep(.el-select) {
  width: 200px;
}
</style>
