<template>
  <div>
    {{ store.user }}
  </div>
</template>

<script setup>
import { useAppStore } from "@/stores/app";

const store = useAppStore();
</script>
