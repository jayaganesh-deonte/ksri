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
            <v-list-item v-bind="props" :prepend-icon="item.icon">
              {{ item.title }}
            </v-list-item>
          </template>

          <v-list-item
            v-for="child in item.children"
            :key="child.title"
            :to="child.path"
          >
            {{ child.title }}
          </v-list-item>
        </v-list-group>

        <v-list-item v-else :to="item.path" :prepend-icon="item.icon">
          {{ item.title }}
        </v-list-item>
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
  // Dashboard
  {
    title: "Dashboard",
    path: "/",
    icon: "mdi-view-dashboard",
  },
  // Main/Home Items
  {
    title: "Dainandini",
    path: "/dainandini",
    icon: "mdi-book-music",
  },

  // News & Events
  {
    title: "Updates",
    icon: "mdi-newspaper",
    children: [
      {
        title: "Home Slide Show",
        path: "/slide-show",
        icon: "mdi-image",
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
      },
      {
        title: "Events",
        path: "/events",
      },
    ],
  },

  // Academic
  {
    title: "Academic",
    icon: "mdi-book-education",
    children: [
      {
        title: "Projects Series",
        path: "/projects-series",
      },
      {
        title: "Projects",
        path: "/projects",
      },
      {
        title: "Supervisor",
        path: "/supervisor",
      },
      {
        title: "Students",
        path: "/students",
      },
      {
        title: "Research Articles",
        path: "/research-articles",
      },
    ],
  },

  // Scholars (existing structure maintained)
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
      // {
      //   title: "Modern Scholars",
      //   path: "/modern-scholars",
      // },
    ],
  },

  // Faculty & Administration
  {
    title: "KSRI Faculty",
    icon: "mdi-account-group",
    children: [
      {
        title: "Faculty",
        path: "/faculty",
      },
      {
        title: "Faculty Designation",
        path: "/faculty-designation",
      },

      {
        title: "Chair",
        path: "/chair",
      },
      {
        title: "Advisory Board",
        path: "/advisory-board",
      },
    ],
  },

  // Governing Body (existing structure maintained)
  {
    title: "Governing Body",
    icon: "mdi-account-group",
    path: "/governing-body-members",
    // children: [
    //   {
    //     title: "Present",
    //     path: "/governing-body-members",
    //   },
    //   {
    //     title: "Past",
    //     path: "/governing-body-members-past",
    //   },
    // ],
  },

  // Library
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
  // Publications
  {
    title: "Publications",
    icon: "mdi-book-open-page-variant",
    children: [
      {
        title: "Books",
        path: "/publications-books",
      },
      {
        title: "Journals",
        path: "/publications-journals",
      },
      {
        title: "Committee",
        path: "/publications-committee",
      },
      {
        title: "Additional Publications",
        path: "additional-publications",
      },
    ],
  },

  // Media
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

  // Institution Info
  {
    title: "Institution",
    icon: "mdi-information",
    children: [
      {
        title: "Endowments",
        path: "/endowments",
      },
      {
        title: "Bank Info",
        path: "/bank-info",
      },
      {
        title: "Postal Address",
        path: "/postal-address",
      },
      {
        title: "Milestone",
        path: "/milestone",
      },
    ],
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

  let financeOptions = [
    // donation
    {
      title: "Donation",
      icon: "mdi-cash",
      children: [
        {
          title: "Donation",
          path: "/donation",
        },
        // {
        //   title: "Donation Category",
        //   path: "/donation-category",
        // },
      ],
    },
  ];

  let tempMenu = [...allOptions];

  // if user is super-admin add below options
  if (store.isSuperAdmin) {
    tempMenu = [...tempMenu, ...superAdminMenuOptions];
  }

  // if user.functionality contains finance add below options
  if (
    store.user.functionality &&
    store.user.functionality.includes("finance")
  ) {
    tempMenu = [...tempMenu, ...financeOptions];
  }

  return tempMenu;
});

const logout = async () => {
  const faro = window.faro;
  faro.api.resetUser();

  await signOut();
  // localStorage.clear();

  // window.location.href = "/";
};
</script>
