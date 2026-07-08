import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      name: "login",
      path: "/login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      name: "menu",
      path: "/menu",
      component: () => import("../views/menu/menuView.vue"),
    },
    {
      name: "404",
      path: "/:catchAll(.*)",
      component: () => import("../components/404/index.vue"),
    },
  ],
  // scrollBehavior(to) {
  //   if (to.path === '/') {
  //     // 当路由到根路径时，滚动到顶部
  //     return { x: 0, y: 0 } as ScrollOptions
  //   }
  //   // 其他情况，你可以根据需要自定义滚动行为
  // }
});

export default router;
