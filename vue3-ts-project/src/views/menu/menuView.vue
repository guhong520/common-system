<script setup lang="ts">
import { Menu as IconMenu } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useUserInfo } from "../../store/userInfo";
import departmentMsg from "../../components/depMessage/departmentMsg.vue";
import { computed, ref, onMounted } from "vue";
import { useMessageStore } from "../../store/message";

const userInfoStore = useUserInfo();
const messageStore = useMessageStore();
onMounted(async () => {
  await messageStore.reurnReadList(
    localStorage.getItem("id") as unknown as number
  );
});
const circleUrl = computed(() => userInfoStore.imageUrl);
const readListLength = computed(() => messageStore?.read_list?.length);
const router = useRouter();
// 退出登录
const goLogin = () => {
  router.push("/login");
  localStorage.clear();
};
const goSet = () => {
  router.push("/set");
};
// 部门消息弹窗
const departmentMsgRef = ref();
const openDepartmentMsg = () => {
  departmentMsgRef.value.open();
};
</script>

<template>
  <div class="commen-layout">
    <el-container>
      <el-aside>
        <el-menu class="el-menu-vertical-demo" router>
          <div class="title">集成管理系统</div>
          <el-menu-item index="home">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item
            index="overview"
            v-if="userInfoStore.identity == '超级管理员'"
          >
            <el-icon><Sunrise /></el-icon>
            <span>系统概览</span>
          </el-menu-item>
          <el-sub-menu
            index="3"
            v-if="
              userInfoStore.identity == '超级管理员' ||
              userInfoStore.identity == '用户管理员'
            "
          >
            <template #title>
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item-group title="管理员管理">
              <el-menu-item index="product_manage">产品管理员</el-menu-item>
              <el-menu-item index="user_manage">用户管理员</el-menu-item>
              <el-menu-item index="message_manage">消息管理员</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="员工管理">
              <el-menu-item index="user_list">用户列表</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu
            index="4"
            v-if="
              userInfoStore.identity == '超级管理员' ||
              userInfoStore.identity == '产品管理员' ||
              userInfoStore.identity == '用户'
            "
          >
            <template #title>
              <el-icon><Eleme /></el-icon>
              <span>产品管理</span>
            </template>
            <el-menu-item-group title="入库管理">
              <el-menu-item index="inProduct">入库列表</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="出库管理">
              <el-menu-item index="outProduct">出库列表</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu
            index="5"
            v-if="
              userInfoStore.identity == '消息管理员' ||
              userInfoStore.identity == '超级管理员'
            "
          >
            <template #title>
              <el-icon><MessageBox /></el-icon>
              <span>消息管理</span>
            </template>
            <el-menu-item-group title="消息管理">
              <el-menu-item index="messageList">消息列表</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="回收站">
              <el-menu-item index="messageRecycle">回收站</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-menu-item
            index="file"
            v-if="userInfoStore.identity == '超级管理员'"
          >
            <el-icon><Discount /></el-icon>
            <span>合同管理</span>
          </el-menu-item>
          <el-menu-item
            index="operation_log"
            v-if="userInfoStore.identity == '超级管理员'"
          >
            <el-icon><Tickets /></el-icon>
            <span>操作日志</span>
          </el-menu-item>
          <el-menu-item
            index="Login_log"
            v-if="userInfoStore.identity == '超级管理员'"
          >
            <el-icon><icon-menu></icon-menu></el-icon>
            <span>登录日志</span>
          </el-menu-item>
          <el-menu-item index="set">
            <el-icon><Tools /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <span class="header-left-content"
            >尊敬的{{ userInfoStore.name }}欢迎您登录本系统</span
          >
          <div class="header-right-content">
            <el-badge :is-dot="readListLength > 0" @click="openDepartmentMsg">
              <el-icon size="30"><Message /></el-icon>
            </el-badge>
            <el-avatar :size="30" :src="circleUrl" />
            <el-dropdown>
              <span class="el-dropdown-link">
                设置
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="goSet">设置账号</el-dropdown-item>
                  <el-dropdown-item @click="goSet">更改头像</el-dropdown-item>
                  <el-dropdown-item @click="goLogin">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
  <departmentMsg ref="departmentMsgRef"></departmentMsg>
</template>

<style scoped lang="scss">
.el-main {
  overflow: hidden;
}
.commen-layout {
  height: 100vh;
  overflow-y: hidden;
}
.el-aside {
  height: 100vh;
  background: #2b302b;
  width: 210px;
  .el-menu {
    background-color: #2b302b;
    width: 100%;
    height: 100vh;
    border-right: 0px;
  }
  .title {
    padding: 20px;
    display: flex;
    justify-content: center;
    color: #fff;
  }
  .el-menu-item {
    color: #fff;
  }
}
//无子菜单的
:deep(.el-menu-item:hover) {
  background: #009eff;
}
//有子菜单的
:deep(.el-sub-menu__title:hover) {
  background: #009eff;
}
:deep(.el-sub-menu__title) {
  color: #fff;
}
:deep(.el-menu--inline) {
  background: #2b302b;
}
.el-header {
  display: flex;
  height: 55px;
  background: #262f3e;
  color: #c1c6c8;
  align-items: center;
  justify-content: space-between;
  .header-left-content {
    font-size: 18px;
  }
  .header-right-content {
    width: 160px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
