<template>
  <manageTemplate
    :item="{
      first: '用户管理',
      second: '用户管理员',
    }"
    identity="用户管理员"
    :fetchList="returnListData"
    :getTotal="getIdentityLength"
    :searchMethod="searchUser"
    createTitle="添加用户管理员"
    createButtonText="添加用户管理员"
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
