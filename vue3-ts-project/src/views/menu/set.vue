<script setup lang="ts">
import bread_crumbs from "../../components/publicComponents/bread_crumb.vue";
import { ref, reactive, nextTick } from "vue";
import { Plus } from "@element-plus/icons-vue";
import type { AccountDetailData } from "../../types/set";
import type { UploadProps } from "element-plus";
import { useUserInfo } from "../../store/userInfo";
import { ElMessage } from "element-plus";
import { toRaw } from "@vue/reactivity";
// 部门设置
import type { InputInstance } from "element-plus";
import { bind, changeName, changeEmail, changeSex } from "../../api/userInfo";
import editor from "../../components/setting/editor.vue";
import { bus } from "../../utils/mitt";
import {
  getCompanyName,
  changeCompanyName,
  setDepartment,
  getAllSwiper,
  getDepartment,
  setProduct,
  getProduct,
} from "../../api/setting";
import forget from "../../components/Login/forget.vue";
const userStore = useUserInfo();

const breadcrumbs = ref();
const item = ref({
  first: "系统设置",
});
var accountData: AccountDetailData = reactive({
  account: "",
  name: "",
  sex: "man",
  identity: "",
  department: "",
  email: "",
});
accountData = userStore.$state;
const id = localStorage.getItem("id") as unknown as number;
// 修改密码
const forgetRef = ref();
const changepassword = () => {
  bus.emit("forgetOrEditPass", 2);
  forgetRef.value.open();
};
// 修改名字
const cName = async () => {
  await changeName(id, accountData.name as string);
};

const Csex = async () => {
  await changeSex(id, accountData.sex as string);
};
const CEmail = async () => {
  await changeEmail(id, accountData.email as string);
};
const activeName = ref("first");
// 上传头像

const handleAvatarSuccess: UploadProps["onSuccess"] = (response: any) => {
  if (response.status == 0) {
    userStore.$patch({
      imageUrl: response.url,
    });
    ElMessage({
      message: "头像上传成功",
      type: "success",
    }),
      // 匿名函数后面加一个括号才能自己运行
      (async () => {
        await bind(userStore.account as string, response.onlyId, response.url);
        await userStore.userInfo(id);
      })();
  } else {
    ElMessage({
      message: "头像上传失败",
      type: "error",
    });
  }
};
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.type !== "image/jpeg") {
    ElMessage.error("头像必须是jpg格式!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("头像必须小于2MB!");
    return false;
  }
  return true;
};
const companyName = ref();
const getCompanyNameData = async () => {
  const res = await getCompanyName();
  companyName.value = res.data;
};
getCompanyNameData();
const changeCompanyname = async () => {
  await changeCompanyName(companyName.value);
};
const editorRef = ref();
const openEditor = (id: number) => {
  // 第一个参数是标记，第二个才是传入的值
  bus.emit("editorTitle", id);
  editorRef.value.open();
};
const swiperData = reactive([
  { name: "Swiper1" },
  { name: "Swiper2" },
  { name: "Swiper3" },
  { name: "Swiper4" },
  { name: "Swiper5" },
  { name: "Swiper6" },
]);
const swiperUrl = ref([]);
// 上传轮播图
const handleSwiperSuccess: UploadProps["onSuccess"] = () => {
  getSwiper();
};
// 获取轮播图
const getSwiper = async () => {
  const res = await getAllSwiper();
  swiperUrl.value = res.data;
};
getSwiper();
// 部门设置

const inputValue = ref("");
const dynamicTags = ref(["Tag 1"]);
const getdepartment = async () => {
  const res = await getDepartment();
  dynamicTags.value = res.data;
};
getdepartment();
const inputVisible = ref(false);
const InputRef = ref<InputInstance>();
// 关闭时最后一个函数
const handleClose = async (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
  // toRaw 是 Vue 3 提供的一个实用函数，其作用是返回响应式对象的原始对象。
  const res1 = JSON.stringify(toRaw(dynamicTags.value));
  await setDepartment(res1);
};
// 点击按钮出现的输入框
const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};
// 输入数据后的确认函数
const handleInputConfirm = async () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value);
    const res1 = JSON.stringify(toRaw(dynamicTags.value));
    await setDepartment(res1);
  }
  inputVisible.value = false;
  inputValue.value = "";
};

// 产品设置

const InputCategoryRef = ref<InputInstance>();
const dynamicCategoryTags = ref<string[]>(["Tag 1"]);
const getcategory = async () => {
  const res = await getProduct();
  dynamicCategoryTags.value = res.data;
};
getcategory();
const inputCategoryVisible = ref(false);
const inputCategoryValue = ref("");
// 关闭时最后一个函数
const handleCategoryClose = async (tag: string) => {
  dynamicCategoryTags.value.splice(dynamicCategoryTags.value.indexOf(tag), 1);
  // toRaw 是 Vue 3 提供的一个实用函数，其作用是返回响应式对象的原始对象。
  const res1 = JSON.stringify(toRaw(dynamicCategoryTags.value));
  await setProduct(res1);
};
// 点击按钮出现的输入框
const showCategoryInput = () => {
  inputCategoryVisible.value = true;
  nextTick(() => {
    InputCategoryRef.value!.input!.focus();
  });
};
// 输入数据后的确认函数
const handleCategoryInputConfirm = async () => {
  if (inputCategoryValue.value) {
    dynamicCategoryTags.value.push(inputCategoryValue.value);
    const res1 = JSON.stringify(toRaw(dynamicCategoryTags.value));
    await setProduct(res1);
  }
  inputCategoryVisible.value = false;
  inputCategoryValue.value = "";
};
</script>

<template>
  <bread_crumbs ref="breadcrumbs" :item="item"></bread_crumbs>
  <!-- 外壳 -->
  <div class="common-wrapped">
    <!-- 内容 -->
    <div class="common-content">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="账号详情" name="first">
          <div class="account-infor-wrapped">
            <span>用户头像: </span>
            <div class="account-infor-content">
              <el-upload
                class="avatar-uploader"
                action="http://ghong.asia/user/uploadAvatar"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="userStore.imageUrl"
                  :src="userStore.imageUrl"
                  class="avatar"
                />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </div>
          </div>
          <div class="account-infor-wrapped">
            <span>用户账号: </span>
            <div class="account-infor-content">
              <el-input disabled v-model="accountData.account"></el-input>
            </div>
          </div>
          <div class="account-infor-wrapped">
            <span>用户密码: </span>

            <el-button
              class="account-save-button"
              type="primary"
              @click="changepassword"
              >修改密码</el-button
            >
          </div>
          <div class="account-infor-wrapped">
            <span>用户姓名: </span>
            <div class="account-infor-content">
              <el-input v-model="accountData.name"></el-input>
            </div>

            <el-button class="account-save-button" type="primary" @click="cName"
              >保存</el-button
            >
          </div>
          <div class="account-infor-wrapped">
            <span>用户性别: </span>
            <div class="account-infor-content">
              <el-select v-model="accountData.sex">
                <el-option label="男" value="man"></el-option>
                <el-option label="女" value="woman"></el-option>
              </el-select>
            </div>
            <el-button class="account-save-button" type="primary" @click="Csex"
              >保存</el-button
            >
          </div>
          <div class="account-infor-wrapped">
            <span>用户身份: </span>
            <div class="account-infor-content">
              <el-input disabled v-model="accountData.identity"></el-input>
            </div>
          </div>
          <div class="account-infor-wrapped">
            <span>用户部门: </span>
            <div class="account-infor-content">
              <el-input disabled v-model="accountData.department"></el-input>
            </div>
          </div>
          <div class="account-infor-wrapped">
            <span>用户邮箱: </span>
            <div class="account-infor-content">
              <el-input v-model="accountData.email"></el-input>
            </div>
            <el-button
              class="account-save-button"
              type="primary"
              @click="CEmail"
              >保存</el-button
            >
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="公司信息"
          name="second"
          v-if="userStore.identity == '超级管理员'"
        >
          <div class="account-infor-wrapped">
            <span>公司名称</span>
            <div class="account-infor-content">
              <el-input v-model="companyName"></el-input>
            </div>
            <div class="account-save-button">
              <el-button type="primary" @click="changeCompanyname"
                >编辑公司名称</el-button
              >
            </div>
          </div>
          <div class="account-infor-wrapped">
            <span>公司介绍</span>
            <div class="account-save-button">
              <el-button type="success" @click="openEditor(1)"
                >编辑公司介绍</el-button
              >
            </div>
          </div>
          <div class="account-infor-wrapped">
            <span>公司架构</span>
            <div class="account-save-button">
              <el-button type="success" @click="openEditor(2)"
                >编辑公司架构</el-button
              >
            </div>
          </div>
          <div class="account-infor-wrapped">
            <span>公司战略</span>
            <div class="account-save-button">
              <el-button type="success" @click="openEditor(3)"
                >编辑公司战略</el-button
              >
            </div>
          </div>
          <div class="account-infor-wrapped">
            <span>现任高层</span>
            <div class="account-save-button">
              <el-button type="success" @click="openEditor(4)"
                >编辑现任高层</el-button
              >
            </div>
          </div>
          <editor ref="editorRef"></editor>
        </el-tab-pane>
        <el-tab-pane
          label="页面管理"
          name="third"
          v-if="userStore.identity == '超级管理员'"
        >
          <div class="home-wrapped">
            <div class="tips">
              <span> 提示： 点击图片框可以切换首页轮播图 </span>
            </div>
            <div
              class="swiper-wrapped"
              v-for="(item, index) in swiperData"
              :key="index"
            >
              <div class="swiper-name">{{ item.name }}</div>
              <el-upload
                class="avatar-uploader"
                :action="'http://ghong.asia/set/uploadSwiper'"
                :show-file-list="false"
                :on-success="handleSwiperSuccess"
                :before-upload="beforeAvatarUpload"
                :data="item"
              >
                <template #trigger>
                  <img
                    v-if="swiperUrl[index]"
                    :src="swiperUrl[index]"
                    class="swiper"
                  />
                  <img
                    src="../../assets/等待上传.jpg"
                    alt=""
                    v-else
                    class="swiper"
                  />
                </template>
              </el-upload>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="其他设置"
          name="fourth"
          v-if="userStore.identity == '超级管理员'"
        >
          <div class="other-set">
            <div class="department-set">
              <span>部门设置</span>
              <el-tag
                v-for="tag in dynamicTags"
                :key="tag"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="inputVisible"
                ref="InputRef"
                v-model="inputValue"
                class="w-20"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
              />
              <el-button v-else class="button-new-tag" @click="showInput">
                + 添加新的部门
              </el-button>
            </div>
            <div class="department-set">
              <span>产品设置</span>
              <el-tag
                v-for="categpryTag in dynamicCategoryTags"
                :key="categpryTag"
                closable
                :disable-transitions="false"
                @close="handleCategoryClose(categpryTag)"
              >
                {{ categpryTag }}
              </el-tag>
              <el-input
                v-if="inputCategoryVisible"
                ref="InputCategoryRef"
                v-model="inputCategoryValue"
                class="w-20"
                @keyup.enter="handleCategoryInputConfirm"
                @blur="handleCategoryInputConfirm"
              />
              <el-button
                v-else
                class="button-new-tag"
                @click="showCategoryInput"
              >
                + 添加新的产品
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <forget ref="forgetRef"></forget>
</template>

<style scoped lang="scss">
.common-wrapped {
  background-color: #f5f5f5;
  height: calc(100vh - 100px);
  padding: 5px;
  overflow-y: hidden;
  .common-content {
    background-color: #fff;
    padding: 0 10px;
    height: 100%;
  }
  .account-infor-wrapped {
    display: flex;
    align-items: center;
    padding-left: 50px;
    margin-bottom: 24px;
    // 账号信息内容
    .account-infor-content {
      margin-left: 24px;
    }
    .account-save-button {
      margin-left: 80px;
    }
    .el-select {
      width: 240px;
    }
  }

  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
  .home-wrapped {
    padding-left: 50px;
    display: flex;
    flex-direction: column;
    .tips {
      align-items: center;
      margin-bottom: 8px;
      span {
        font-size: 16px;
        color: silver;
      }
    }
    .swiper-wrapped {
      display: flex;
      margin-bottom: 16px;
      .swiper-name {
        display: flex;
        font-size: 16px;
        align-items: center;
        margin-right: 20px;
      }
      .swiper {
        width: 300px;
        height: 90px;
      }
    }
  }
  .other-set {
    display: flex;
    flex-direction: column;
    padding-left: 50px;
    font-size: 16px;
    .el-tag {
      font-size: 16px;
    }
    .department-set {
      margin-bottom: 24px;
      span {
        margin-right: 24px;
      }
    }
  }
}
:deep(.el-tabs__item) {
  font-size: 16px;
}
:deep(.el-input) {
  width: 240px;
}
</style>
