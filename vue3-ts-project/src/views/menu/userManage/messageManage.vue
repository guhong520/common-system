<template>
  <manageTemplate
    :item="{
      first: '用户管理',
      second: '消息管理员',
    }"
    identity="消息管理员"
    :fetchList="returnListData"
    :getTotal="getIdentityLength"
    :searchMethod="searchUser"
    createTitle="添加消息管理员"
    createButtonText="添加消息管理员"
  />
</template>

<script lang="ts" setup>
import manageTemplate from "../../../components/userManage/manageTemplate.vue";
import {
  searchUser,
  getIdentityLength,
  returnListData,
} from "../../../api/userInfo";
</script>
