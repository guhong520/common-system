<!--撤回申请 -->
<script lang="ts" setup>
import { ref, onBeforeUnmount, reactive, shallowRef } from "vue";

import { type messageData } from "../../types/message";
import { bus } from "../../utils/mitt";
// 富文本文件
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { publishMessage, editMessage } from "../../api/message";
import { getDepartment } from "../../api/setting";
import { changeUserReadList } from "../../api/dep_msg";
import { useMessageStore } from "../../store/message";

const messageStore = useMessageStore();
// 获取部门
const departmentList = ref();
// 不包括全体成员
const options = ref<string[]>([]);
// 包括全体成员
const Alloptions = ref<string[]>([]);
const getdepartment = async () => {
  const res = await getDepartment();
  departmentList.value = res.data;
  options.value = [...departmentList.value];
  Alloptions.value = [...departmentList.value, "全体成员"];
};
getdepartment();
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
// mode
const mode = ref("default");
// 内容 HTML
const valueHtml = ref();
const toolbarConfig: { excludeKeys: string[] } = {
  excludeKeys: [],
};
toolbarConfig.excludeKeys = [
  "blockquote",
  "bgColor",
  "color",
  "group-more-style",
  "fontFamily",
  "bulletedList",
  "numberedList",
  "lineHeight",
  "todo",
  "emotion",
  "insertLink",
  "group-video",
  "insertTable",
  "codeBlock",
  "divider",
  "fullScreen",
  // 'group-image',

  // 排除菜单组，写菜单组 key 的值即可
];
const editorConfig = {
  placeholder: "请输入内容...",
  MENU_CONF: {},
};
const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

const dialogVisible = ref(false);
const open = () => {
  dialogVisible.value = true;
};
defineExpose({
  open,
});
const ruleForm: messageData = reactive({
  id: 0,
  message_title: "",
  message_publish_department: "",
  message_publish_name: localStorage.getItem("name") as string,
  message_receipt_object: "",
  message_level: "",
  message_category: "",
  message_content: "",
});
const rules = reactive({
  message_title: [{ required: true, message: "请输入主题", trigger: "blur" }],
  message_publish_department: [
    { required: true, message: "请选择发布部门", trigger: "change" },
  ],
  message_receipt_object: [
    { required: true, message: "请选择接受部门", trigger: "change" },
  ],
  message_level: [
    { required: true, message: "请选择公告等级", trigger: "change" },
  ],

  message_content: [
    { required: true, message: "请输入公告内容", trigger: "blur" },
  ],
});
// 对齐方式
const labelPosition = ref("left");
// title
const title = ref("");
bus.on("announcement", (title1: any) => {
  title.value = title1;
  if (title.value == "发布公告") {
    resetForm();
    valueHtml.value = "";
  } else if (title.value == "发布系统消息") {
    resetForm();
    valueHtml.value = "";
  }
});
// 重置表单数据的方法
const resetForm = () => {
  Object.assign(ruleForm, {
    id: 0,
    message_title: "",
    message_publish_department: "",
    message_receipt_object: "",
    message_level: "",
    message_category: "",
    message_content: "",
  });
};
//编辑公司公告与编辑系统消息
bus.on("editAnnouncement", (row: any) => {
  ruleForm.id = row.id;
  ruleForm.message_title = row.message_title;
  ruleForm.message_publish_department = row.message_publish_department;
  ruleForm.message_receipt_object = row.message_receipt_object;
  ruleForm.message_level = row.message_level;
  valueHtml.value = row.message_content;
});
const operationAnnouncement = async () => {
  ruleForm.message_content = valueHtml.value;
  // 根据id来判断父组件更新函数
  let res, id;
  if (title.value == "发布公告") {
    ruleForm.message_category = "公司公告";
    res = await publishMessage(ruleForm);
    // 发布公司公告，要给对应部门的所有人未读消息加上id
    await changeUserReadList(
      res.data.id,
      ruleForm.message_receipt_object as string
    );
    // 更新一下store
    await messageStore.reurnReadList(
      localStorage.getItem("id") as unknown as number
    );
    id = 1;
  }
  if (title.value == "编辑公告") {
    res = await editMessage(ruleForm);
    id = 1;
  }
  if (title.value == "发布系统消息") {
    ruleForm.message_category = "系统消息";
    res = await publishMessage(ruleForm);
    id = 2;
  }
  if (title.value == "编辑系统消息") {
    res = await editMessage(ruleForm);
    id = 2;
  }
  if (res) {
    if (res.data.status === 0) {
      bus.emit("refreshAnnouncement", id);
      // 通知父组件更新数据
    }
  }
  dialogVisible.value = false;
};
onBeforeUnmount(() => {
  bus.all.clear();
});
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="700px"
    draggable="true"
    destroy-on-close
  >
    <div class="dialog-content">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        status-icon
        :label-position="labelPosition"
      >
        <el-form-item label="主题" prop="message_title">
          <el-input
            v-model="ruleForm.message_title"
            placeholder="请输入消息主题"
          />
        </el-form-item>
        <el-form-item
          v-if="title == '发布公告' || title == '编辑公告'"
          label="发布部门"
          prop="message_publish_department"
        >
          <el-select
            v-model="ruleForm.message_publish_department"
            placeholder="选择发布部门"
          >
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="title == '发布公告' || title == '编辑公告'"
          label="接受部门"
          prop="message_receipt_object"
        >
          <el-select
            v-model="ruleForm.message_receipt_object"
            placeholder="请选择接受部门"
          >
            <el-option
              v-for="item in Alloptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="title == '发布公告' || title == '编辑公告'"
          label="公告等级"
          prop="message_level"
        >
          <el-select
            v-model="ruleForm.message_level"
            placeholder="请选择公告等级"
          >
            <el-option value="一般">一般</el-option>
            <el-option value="重要">重要</el-option>
            <el-option value="必要">必要</el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="title" label="内容" prop="message_content">
          <div style="border: 1px solid #ccc">
            <!-- wangEditor结构 -->
            <Toolbar
              style="border-bottom: 1px solid #ccc; width: 600px"
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              :mode="mode"
            />
            <Editor
              style="height: 300px; width: 600px; overflow-y: hidden"
              v-model="valueHtml"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="handleCreated"
            />
          </div>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="operationAnnouncement">确 定</el-button>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
