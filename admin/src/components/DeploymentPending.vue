<template>
  <div>
    <v-system-bar
      v-if="store.isDeploymentPending && !store.isDeploymentInProgress"
      class="px-4 py-2"
      order="1"
    >
      <v-spacer />
      <div class="text-body-1">There are pending Changes to be Published.</div>
      <v-btn
        color="primary"
        @click="deployChanges"
        size="x-small"
        rounded="pill"
        class="mx-4"
      >
        Published Now
      </v-btn>
      <v-spacer />
    </v-system-bar>
    <!-- isDeploymentInProgress -->

    <!-- <v-system-bar> store {{ store.deploymentStatus }} </v-system-bar> -->

    <v-system-bar
      v-if="store.isDeploymentInProgress"
      class="px-4 py-2"
      order="1"
    >
      <v-spacer />
      <div class="text-body-1">
        Site is being updated. Changes will be reflected in 3 minutes.
      </div>
      <v-progress-circular
        indeterminate
        color="primary"
        class="ma-2"
        size="16"
      ></v-progress-circular>
      <v-spacer />
    </v-system-bar>
  </div>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { onMounted } from "vue";

const store = useAppStore();

onMounted(async () => {
  await store.checkDeploymentStatus();

  await store.getDeploymentStatus();

  // run checkDeploymentStatus every 3 minutes
  setInterval(async () => {
    await store.checkDeploymentStatus();
    await store.getDeploymentStatus();
  }, 180000);
});

const deployChanges = async () => {
  await store.deploy();
};
</script>
