<template>
  <div class="">
    <contributeHeader />
  </div>
</template>
<script setup>
const description =
  "We earnestly solicit contributions from lovers of Sanskrit and Indian culture to help us by contributing their mite in preserving our ancient treasure.";

useSeoMeta({
  title: "Contribute",
  description: description,
  ogTitle: "Contribute",
  ogDescription: description,
  twitterTitle: "Contribute",
  twitterDescription: description,
});
import contributeHeader from "./contributeHeader.vue";
</script>
