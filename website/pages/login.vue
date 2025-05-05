<template>
  <div class="d-flex justify-center align-center">
    <!-- show circular progress -->
    <v-progress-circular
      size="100"
      indeterminate
      color="primary"
    ></v-progress-circular>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["authenticated"],
});

import { userStore } from "~/stores/UserStore";

const store = userStore();

const { getIsAuthenticated } = storeToRefs(store);

// wait for next tick and if authenticated redirect to home
onMounted(() => {
  nextTick(() => {
    console.log("isAuthenticated", getIsAuthenticated);
    if (getIsAuthenticated.value) {
      navigateTo("/");
    }
  });
});
</script>
