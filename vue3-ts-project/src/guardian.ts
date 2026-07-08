import router from "./router";
router.beforeEach(async (to) => {
  const token = localStorage.getItem("token");
  if (
    // 检查用户是否已登录
    !token &&
    // ❗️ 避免无限重定向
    to.name !== "login"
  ) {
    // 将用户重定向到登录页面
    return { name: "login" };
  } else {
    return true;
  }
});
