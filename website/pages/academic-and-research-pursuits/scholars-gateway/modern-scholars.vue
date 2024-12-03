<template>
  <div class="mx-4">
    <scholarsHeader />

    <div class="text-center my-6">
      <section-title title="List of Modern Scholars" />
      <div class="text-h6" data-aos="fade-up" data-aos-delay="200">
        The Kuppuswami Sastri Research Institute provides ample opportunities
        for scholars who are interested in higher studies.
      </div>
      <ModernScholars />
    </div>
  </div>
</template>

<script setup>
import scholarsHeader from "./scholarsHeader.vue";

import ModernScholars from "./components/ModernScholars.vue";
</script>
