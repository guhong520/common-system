import { defineStore } from "pinia";
import { getUserInfo } from "../api/userInfo";
import { ref } from "vue";
export const useUserInfo = defineStore(
  "userinfo",
  () => {
    const imageUrl = ref<string>();
    const identity = ref<string>();
    const department = ref<string>();
    const name = ref<string>();
    const account = ref<string>();
    const email = ref<string>();
    const userInfo = async (id: number) => {
      const res = (await getUserInfo(id)) as any;
      imageUrl.value = res.data.image_url;
      identity.value = res.data.identity;
      department.value = res.data.department;
      name.value = res.data.name;
      account.value = res.data.account;
      email.value = res.data.email;
      return res;
    };

    return {
      imageUrl,
      userInfo,
      identity,
      department,
      name,
      account,
      email,
    };
  },
  {
    persist: true,
  }
);
