<template>
  <v-app-bar app color="primary">
    <v-app-bar-nav-icon @click="drawer = !drawer" />

    <v-toolbar-title>KSRI Admin</v-toolbar-title>

    <!-- show profile icon if logged in -->
    <v-spacer />
    <v-btn> welcome, {{ store.user.username }}! </v-btn>
    <v-btn icon @click="logout">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" app>
    <v-list>
      <template v-for="item in menuOptions" :key="item.title">
        <v-list-group v-if="item.children">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :title="item.title"
              :prepend-icon="item.icon"
            />
          </template>

          <v-list-item
            v-for="child in item.children"
            :key="child.title"
            :to="child.path"
            :title="child.title"
          />
        </v-list-group>

        <v-list-item
          v-else
          :to="item.path"
          :title="item.title"
          :prepend-icon="item.icon"
        />
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from "vue";

import { useAppStore } from "@/stores/app";

import { signOut } from "aws-amplify/auth";

const drawer = ref(false);

const store = useAppStore();

const allOptions = [
  {
    title: "Dainandini",
    path: "/",
    icon: "mdi-book-music",
  },
  {
    title: "Home Dialog",
    path: "/home-dialog",
    icon: "mdi-post-outline",
  },
  {
    title: "Banner Text",
    path: "/banner-text",
    icon: "mdi-text",
  },

  {
    title: "News",
    path: "/news",
    icon: "mdi-newspaper",
  },
  {
    title: "Events",
    path: "/events",
    icon: "mdi-calendar",
  },
  {
    title: "Projects",
    path: "/projects",
    icon: "mdi-book-education",
  },
  {
    title: "Students",
    path: "/students",
    icon: "mdi-account-school",
  },
  {
    title: "Scholars",
    icon: "mdi-account-school",
    children: [
      {
        title: "Traditional Scholars",
        path: "/traditional-scholars",
      },
      {
        title: "Foreign Scholars",
        path: "/foreign-scholars",
      },
      {
        title: "Modern Scholars",
        path: "/modern-scholars",
      },
    ],
  },

  {
    title: "Faculty",
    path: "/faculty",
    icon: "mdi-account-tie",
  },
  {
    title: "Governing Body Members",
    icon: "mdi-account-group",
    children: [
      {
        title: "Present",
        path: "/governing-body-members",
      },
      {
        title: "Past",
        path: "/governing-body-members-past",
      },
    ],
  },
  {
    title: "Library",
    icon: "mdi-library",
    children: [
      {
        title: "Articles",
        path: "/library-articles",
      },
      {
        title: "Books",
        path: "/library-books",
      },
      {
        title: "Journals",
        path: "/library-journals",
      },
    ],
  },
  {
    title: "Publications",
    icon: "mdi-book-open-page-variant",
    children: [
      {
        title: "books",
        path: "/publications-books",
      },
      {
        title: "Committee",
        path: "/publications-committee",
      },
    ],
  },
  {
    title: "Gallery",
    icon: "mdi-image",
    children: [
      {
        title: "Collection",
        path: "/gallery-collections",
      },
      {
        title: "Images",
        path: "/gallery-images",
      },
    ],
  },

  {
    title: "supervisor",
    path: "/supervisor",
    icon: "mdi-account-tie",
  },
  {
    title: "Research Articles",
    path: "/research-articles",
    icon: "mdi-book-open-page-variant",
  },
  {
    title: "Endowments",
    path: "/endowments",
    icon: "mdi-projector-screen",
  },
  {
    title: "Milestone",
    path: "/milestone",
    icon: "mdi-sign-direction",
  },
];

let menuOptions = computed(() => {
  let superAdminMenuOptions = [
    {
      title: "Users",
      path: "/users",
      icon: "mdi-account",
    },
  ];

  let tempMenu = [...allOptions];

  // if user is super-admin add below options
  if (localStorage.getItem("role") === "super-admin") {
    tempMenu = [...tempMenu, ...superAdminMenuOptions];
  }

  return tempMenu;
});

const logout = async () => {
  await signOut();
  localStorage.clear();

  window.location.href = "/";
};
</script>
