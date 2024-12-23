<template>
  <v-app>
    <app-bar />
    <DeploymentPending />
    <v-main>
      <Suspense class="ma-4 pa-4">
        <router-view class="ma-4 pa-4" />
      </Suspense>
    </v-main>
  </v-app>
</template>

<script setup>
//
</script>
