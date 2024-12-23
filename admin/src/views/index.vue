<template>
  <div>
    <!-- in dashboard, 1st row show previous successful deployment time and also a button to trigger deployment now -->
    <!-- { "status": "SUCCEEDED", "timestamp": "2024-12-22T17:58:27.411Z" } -->
    <div v-if="store.deploymentStatus">
      <div>
        <v-alert
          :value="true"
          type="success"
          elevation="2"
          icon="mdi-check-circle"
          outlined
          text
        >
          Site was last publised on
          {{ convertToLocalTime(store.deploymentStatus.timestamp) }}.
        </v-alert>
      </div>
    </div>

    <!-- create cards to show dashboard data -->
    <v-row class="ma-4">
      <v-col v-for="item in dashboardData" :key="item.title" cols="12" md="4">
        <v-card class="pa-4" color="greenBg">
          <div class="d-flex justify-space-between">
            <div class="text-h6">{{ item.title }}</div>
            <v-icon size="24">{{ item.icon }}</v-icon>
          </div>
          <div class="text-h4">{{ item.total }}</div>
        </v-card>
      </v-col>
    </v-row>
    <!-- small info showing numbers will be updated once in a day -->
    <div class="d-flex justify-end ma-4">
      <div>
        <v-icon size="24">mdi-information</v-icon>
        <span class="ml-2">Numbers shown above are updated once in a day.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { onMounted } from "vue";

const store = useAppStore();

onMounted(async () => {
  await store.getDeploymentStatus();
});

const convertToLocalTime = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

const dashboardData = [
  {
    title: "Upcoming Events",
    total: 0,
    icon: "mdi-calendar-clock",
  },
  {
    title: "Total Events",
    total: 0,
    icon: "mdi-calendar",
  },
  {
    // News
    title: "News",
    total: 0,
    icon: "mdi-newspaper",
  },
  {
    title: "Books Published",
    total: 0,
    icon: "mdi-book-open-page-variant",
  },

  {
    // Projects
    title: "On-Going Projects",
    total: 0,
    icon: "mdi-folder-open",
  },
  {
    title: "Completed Projects",
    total: 0,
    icon: "mdi-folder",
  },
  // Research Articles
  {
    title: "Articles",
    total: 0,
    icon: "mdi-file-document",
  },

  // phd students
  {
    title: "PhD Students",
    total: 0,
    icon: "mdi-account-school",
  },
  // Mphil Students
  {
    title: "MPhil Students",
    total: 0,
    icon: "mdi-account-school",
  },

  // Users for the system
  {
    title: "System Users",
    total: 0,
    icon: "mdi-account",
  },
];
</script>
