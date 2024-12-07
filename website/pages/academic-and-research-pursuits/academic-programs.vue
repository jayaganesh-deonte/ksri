<template>
  <div class="ma-8">
    <div>
      <section-title title="ACADEMIC PROGRAMS" />
      <div class="sectionSubtitle2">
        KSRI is affiliated to the University of Madras and offers M.Phil and
        Ph.D programs. Scholars pursuing Research under these programs
      </div>
    </div>
    <ModernScholars />
  </div>
</template>

<script setup>
useSeoMeta({
  title: "Academic Programs",
  description:
    "KSRI is affiliated to the University of Madras and offers M.Phil and Ph.D programs. Scholars pursuing Research under these programs",
  ogTitle: "Academic Programs",
  ogDescription:
    "KSRI is affiliated to the University of Madras and offers M.Phil and Ph.D programs. Scholars pursuing Research under these programs",
  twitterTitle: "Academic Programs",
  twitterDescription:
    "KSRI is affiliated to the University of Madras and offers M.Phil and Ph.D programs. Scholars pursuing Research under these programs",
});
import ModernScholars from "./scholars-gateway/components/ModernScholars.vue";
</script>
