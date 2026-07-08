import { defineStore } from "pinia";
import { ref } from "vue";
import { getReadListAndStatus, getDepartmentMsgList } from "../api/dep_msg";

export const useMessageStore = defineStore(
  "message",
  () => {
    const read_list = ref<number[]>([]);
    const messageList = ref<any[]>([]);
    const reurnReadList = async (id: number) => {
      read_list.value = [];
      messageList.value = [];
      const res = await getReadListAndStatus(id);
      // 可能为空
      read_list.value = JSON.parse(res.data[0].read_list)! as number[];
      //   用来更新消息
      const res1 = await getDepartmentMsgList(
        localStorage.getItem("department") as string
      );
      messageList.value = res1.data;
      console.log("messageList", messageList.value);
      return 1;
    };
    return {
      read_list,
      reurnReadList,
      messageList,
    };
  },
  {
    persist: true,
  }
);
