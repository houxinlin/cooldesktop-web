import { createRouter, createWebHistory } from "vue-router";

const constantRoutes = [
  {
    path: "/",
    name: "Index",
    component: () => import("../views/index.vue")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
});

export default router;
