import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import pinia from "./store/index";
import ElementPlus from "element-plus";
// 导入svg图标
import "virtual:svg-icons-register"; //svg插件所需配置代码
// 引入全局样式
import "./assets/css/manage.css";
import "./guardian.ts"; //路由守卫
import { useMenu } from "./store/menu.ts";
// import "element-plus/dist/index.css";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(ElementPlus);
app.use(pinia);
const menuStore = useMenu();

menuStore.addRouter();

app.use(router);
app.mount("#app");
