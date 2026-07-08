<template>
  <manageTemplate
    :item="{
      first: '产品管理',
      second: '产品管理员',
    }"
    identity="产品管理员"
    :fetchList="returnListData"
    :getTotal="getIdentityLength"
    :searchMethod="searchUser"
    createTitle="添加产品管理员"
    createButtonText="添加产品管理员"
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
