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
import journals from "@/views/library/journals.vue";

import publicationsBooks from "@/views/publications/publicationsBooks.vue";
import publicationCommittee from "@/views/publications/publicationCommittee.vue";

import faculty from "@/views/faculty.vue";

import galleryCollections from "@/views/gallery/galleryCollections.vue";
import galleryImages from "@/views/gallery/galleryImages.vue";

import news from "@/views/news.vue";
import events from "@/views/events.vue";

import supervisor from "@/views/supervisor.vue";
import researchArticles from "@/views/researchArticles.vue";

import dainandini from "@/views/dainandini.vue";
import homeDialog from "@/views/homeDialog.vue";

import bannerText from "@/views/bannerText.vue";

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
  {
    path: "/library-journals",
    name: "journals",
    component: journals,
    meta: { requiresAuth: true },
  },
  {
    path: "/publications-books",
    name: "publicationsBooks",
    component: publicationsBooks,
    meta: { requiresAuth: true },
  },
  {
    path: "/publications-committee",
    name: "publicationCommittee",
    component: publicationCommittee,
    meta: { requiresAuth: true },
  },
  {
    path: "/faculty",
    name: "faculty",
    component: faculty,
    meta: { requiresAuth: true },
  },
  {
    path: "/gallery-collections",
    name: "galleryCollections",
    component: galleryCollections,
    meta: { requiresAuth: true },
  },
  {
    path: "/gallery-images",
    name: "galleryImages",
    component: galleryImages,
    meta: { requiresAuth: true },
  },
  {
    path: "/news",
    name: "news",
    component: news,
    meta: { requiresAuth: true },
  },
  {
    path: "/supervisor",
    name: "supervisor",
    component: supervisor,
    meta: { requiresAuth: true },
  },
  {
    path: "/research-articles",
    name: "researchArticles",
    component: researchArticles,
    meta: { requiresAuth: true },
  },
  {
    path: "/dainandini",
    name: "dainandini",
    component: dainandini,
    meta: { requiresAuth: true },
  },
  {
    path: "/home-dialog",
    name: "homeDialog",
    component: homeDialog,
    meta: { requiresAuth: true },
  },
  {
    path: "/banner-text",
    name: "bannerText",
    component: bannerText,
    meta: { requiresAuth: true },
  },
  {
    path: "/events",
    name: "events",
    component: events,
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
