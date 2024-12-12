<template>
  <v-app-bar app color="primary">
    <v-app-bar-nav-icon @click="drawer = !drawer" />

    <v-toolbar-title>KSRI Admin</v-toolbar-title>
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
import { ref } from "vue";

const drawer = ref(false);

const menuOptions = [
  {
    title: "Milestone",
    path: "/milestone",
    icon: "mdi-sign-direction",
  },
  {
    title: "Projects",
    path: "/projects",
    icon: "mdi-book-education",
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
    title: "Endowments",
    path: "/endowments",
    icon: "mdi-account-tie",
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
    title: "News",
    path: "/news",
    icon: "mdi-newspaper",
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
];
</script>
