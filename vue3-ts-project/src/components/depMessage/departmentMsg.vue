<!-- 主页消息 -->
<script lang="ts" setup>
import { ref, onBeforeUnmount, reactive } from "vue";
import { bus } from "../../utils/mitt";
import { updateClick } from "../../api/message";
import {
  getDepartmentMsg,
  getDepartmentMsgList,
  getReadListAndStatus,
  clickDelete,
} from "../../api/dep_msg";
import { useUserInfo } from "../../store/userInfo";
import { useMessageStore } from "../../store/message";

const userInfo = useUserInfo();
const messageStore = useMessageStore();
const dialogVisible = ref(false);
const open = () => {
  dialogVisible.value = true;
};
defineExpose({
  open,
});
const messageInfor = reactive({
  message_title: "",
  message_content: "",
});
const tableData = ref([]);

// 当前未读消息，更细readList
const readList = ref<number[]>([]);
const id = localStorage.getItem("id") as unknown as number;
const department = userInfo.department as string;
const getUserDepartmentMsg = async () => {
  if (department !== "") {
    const status = await getReadListAndStatus(id);
    const res1 = await getDepartmentMsgList(department);
    tableData.value = res1.data;
    // 如果员工是新来的或者未读过部门消息，status就为0，就要获取部门全部消息
    // 否则就是获取之前为读的消息
    if (status.data[0].read_status === 0) {
      const res = await getDepartmentMsg(id, department);
      readList.value = res.data.read_list;
    } else {
      readList.value = status.data[0].read_list;
    }
  }
};
getUserDepartmentMsg();

// 获取消息内容
const getDetail = async (row: any) => {
  await updateClick(row.message_click_number, row.id);
  await clickDelete(row.id, localStorage.getItem("id") as unknown as number);
  messageInfor.message_title = row.message_title;
  messageInfor.message_content = row.message_content;
  await getUserDepartmentMsg();
};
const isInList = (id: number) => {
  if (readList.value.indexOf(id) !== -1) {
    return 0;
  } else {
    return 1;
  }
};
onBeforeUnmount(() => {
  bus.all.clear();
});
</script>
<template>
  <el-dialog v-model="dialogVisible" title="" width="912" draggable="true">
    <el-container>
      <el-aside width="456px">
        <div class="message-list-wrapped">
          <div class="list-table-content">
            <el-table
              :data="
                messageStore.messageList.length > 0
                  ? messageStore.messageList
                  : tableData
              "
              border
              style="width: 100%"
              highlight-current-row
              @row-click="getDetail"
            >
              <el-table-column type="index" width="50" />
              <el-table-column type="index" width="5">
                <template #default="{ row }">
                  <div
                    :class="isInList(row.id) ? 'readed' : 'noread'"
                  ></div> </template
              ></el-table-column>
              <el-table-column prop="message_title" label="主题">
                <template #default="{ row }">
                  <div class="title-wrapped">
                    <div class="title">{{ row.message_title }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="等级" prop="message_level">
                <template #default="{ row }">
                  <el-tag round v-if="row.message_level == '一般'">
                    {{ row.message_level }}
                  </el-tag>
                  <el-tag
                    round
                    v-if="row.message_level == '重要'"
                    type="warning"
                  >
                    {{ row.message_level }}
                  </el-tag>
                  <el-tag
                    round
                    v-if="row.message_level == '必要'"
                    type="danger"
                  >
                    {{ row.message_level }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="message_publish_time"
                label="发布日期"
                width="200"
              >
                <template #default="{ row }">
                  <div>{{ row.message_publish_time?.slice(0, 10) }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-aside>
      <el-main>
        <div class="detail-wrapped" v-if="messageInfor.message_title !== ''">
          <div class="detail-title">
            <span>主题：</span>{{ messageInfor.message_title }}
          </div>
          <div v-html="messageInfor.message_content"></div>
        </div>
        <div class="detail-wrapped" v-else>请点击消息中的列表进行查看</div>
      </el-main>
    </el-container>
  </el-dialog>
</template>
<style lang="scss" scoped>
.el-aside {
  padding-left: 8px;
  min-height: 500px;
}
.el-main {
  min-height: 500px;
  --el-main-padding: 0;
  border-left: 3px solid #eee;
}
.message-list-wrapped {
  height: 500px;
  .list-table-content {
    padding: 8px;
    min-height: 10px;
    .title-wrapped {
      display: flex;
      align-items: center;
      .title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.detail-wrapped {
  .detail-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
  }
  padding: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.readed {
  display: block;
  width: 5px;
  padding: 1px;
  height: 5px;
  border-radius: 50%;
  background-color: #fff;
}

.noread {
  display: block;
  width: 5px;
  padding: 1px;
  height: 5px;
  border-radius: 50%;
  background-color: red;
}
</style>
