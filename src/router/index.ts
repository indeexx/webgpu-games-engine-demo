/*
 * @Author: indeex
 * @Date: 2021-03-02 11:28:13
 * @Email: indeex@qq.com
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
const routes: Array<any> = [
  {
    path: "/",
    name: "Home",
    meta: {
      title: "首页",
      keepAlive: true
    },
    component: () => import("../views/Home/index.vue"),
  }
];
const router = createRouter({
  history: createWebHashHistory(),
  routes
});
export default router;