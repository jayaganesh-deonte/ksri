import { createRouter, createWebHistory } from "vue-router";

import {
  getCurrentUser,
  signInWithRedirect,
  fetchUserAttributes,
  fetchAuthSession,
} from "aws-amplify/auth";

import { useAppStore } from "@/stores/app";

import index from "@/views/index.vue";
import milestone from "@/views/milestone.vue";
import projects from "@/views/projects.vue";

import traditionalScholars from "@/views/scholars/traditionalScholars.vue";
import foreignScholars from "@/views/scholars/foreignScholars.vue";
import modernScholars from "@/views/scholars/modernScholars.vue";

import endowments from "@/views/endowments.vue";

import governingBodyMembersPast from "@/views/governingBodyMembers/governingBodyMembersPast.vue";
import governingBodyMembersPresent from "@/views/governingBodyMembers/governingBodyMembersPresent.vue";

import articles from "@/views/library/articles.vue";
import books from "@/views/library/books.vue";

const routes = [
  {
    path: "/",
    name: "index",
    component: index,
    meta: { requiresAuth: true },
  },
  {
    path: "/milestone",
    name: "milestone",
    component: milestone,
    meta: { requiresAuth: true },
  },
  {
    path: "/projects",
    name: "projects",
    component: projects,
    meta: { requiresAuth: true },
  },
  {
    path: "/traditional-scholars",
    name: "traditionalScholars",
    component: traditionalScholars,
    meta: { requiresAuth: true },
  },
  {
    path: "/foreign-scholars",
    name: "foreignScholars",
    component: foreignScholars,
    meta: { requiresAuth: true },
  },
  {
    path: "/modern-scholars",
    name: "modernScholars",
    component: modernScholars,
    meta: { requiresAuth: true },
  },
  {
    path: "/endowments",
    name: "endowments",
    component: endowments,
    meta: { requiresAuth: true },
  },
  {
    path: "/governing-body-members-past",
    name: "governingBodyMembersPast",
    component: governingBodyMembersPast,
    meta: { requiresAuth: true },
  },
  {
    path: "/governing-body-members",
    name: "governingBodyMembersPresent",
    component: governingBodyMembersPresent,
    meta: { requiresAuth: true },
  },
  {
    path: "/library-articles",
    name: "articles",
    component: articles,
    meta: { requiresAuth: true },
  },
  {
    path: "/library-books",
    name: "books",
    component: books,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  //scroll to top of page
  window.scrollTo(0, 0);
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    console.log("Auth required");
    try {
      const currentUser = await getCurrentUser();

      const { username } = currentUser;

      const userAttributes = await fetchUserAttributes();

      // current user group
      const { idToken } = (await fetchAuthSession()).tokens || {};

      const groups = idToken?.payload["cognito:groups"] || [];

      const appStore = useAppStore();
      appStore.setUser({
        username,
        email: userAttributes.email,
        groups,
      });
      appStore.setUserRole(groups);
    } catch (error) {
      console.error(error);
      signInWithRedirect();
    }
  }
  next();
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
