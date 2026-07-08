import { defineStore } from "pinia";
import router from "../router";
import { ref } from "vue";
export const useMenu = defineStore(
  "menuInfo",
  () => {
    // 为了防止已刷新就白屏，创建一个store持久化数据
    const menuList = ref<any[]>([]);
    const setRouter = (arr: any) => {
      function compilerMenu(arr: any) {
        if (!arr) {
          return;
        }
        menuList.value = arr;
        menuList.value.forEach((item: any) => {
          let rts = {
            name: item.name,
            path: item.path,
            meta: item.meta,
            component: item.component,
          };
          if (item.children && item.children.length) {
            compilerMenu(item.children);
          }
          //拼接路由
          if (!item.children) {
            let path = loadComponent(item.component);
            rts.component = path;
            // 这是将路由添加到父路由menu下
            router.addRoute("menu", rts);
          }

          function loadComponent(url: string) {
            let Module = import.meta.glob("@/views/**/*.vue");
            return Module[`/src/views/${url}.vue`];
          }
        });
      }
      compilerMenu(arr as any);
    };
    const addRouter = () => {
      setRouter(menuList.value);
    };
    return {
      setRouter,
      addRouter,
      menuList,
    };
  },
  {
    persist: true,
  }
);
