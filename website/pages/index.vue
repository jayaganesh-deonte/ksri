<template>
  <div>
    <marqueeTexts />
    <HomeCarousel />
    <Dainandini />
    <HomeFounderIntro />
    <v-card> <VisionAndMission class="mt-12" /> </v-card>
    <Contribute class="mt-12" />
    <LibraryHomeCard class="mt-12" />
    <TImeLine />

    <!-- create dialog component -->
    <home-alert-dialog />
  </div>
</template>

<script setup>
// check if in local storage redirect key is present
if (process.client) {
  const redirect = localStorage.getItem("redirect");
  if (redirect) {
    localStorage.removeItem("redirect");
    window.location.href = redirect;
  }
}
</script>
