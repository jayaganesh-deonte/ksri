<template>
  <div>
    <div class="text-center my-12">
      <div
        class="text-h4 text-secondary font-weight-bold"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        KSRI LIBRARY ONLINE
      </div>
      <div class="text-h6" data-aos="fade-up" data-aos-delay="400">
        KSRI has already digitalized the entire collection of palm leaf
        manuscripts and paper manuscripts. Around 1100 old and rare books have
        also been digitalized.
      </div>
    </div>
    <div class="text-center">
      <div
        class="sectionSubtitle my-4"
        data-aos="fade-right"
        data-aos-delay="600"
      >
        Overview
      </div>
      <div class="text-h6" data-aos="fade-left" data-aos-delay="900">
        KSRI hopes very soon it can offer valuable service by making the stored
        knowledge available to the world online.
      </div>
    </div>

    <v-card
      class="onlineLibBg d-flex flex-column justify-end my-8"
      :height="$device.isMobile ? '' : '50vh'"
      data-aos="fade-up"
      data-aos-delay="900"
      rounded="0"
    >
      <v-card
        color="primary pa-4  text-h6 mx-auto"
        :class="$device.isMobile ? 'my-4 text-center' : ''"
        :width="$device.isMobile ? '80%' : '50%'"
        data-aos="fade-up"
        data-aos-delay="900"
        rounded="0"
      >
        Under Phase 1 all the palm-leaf manuscripts in the library have been
        digitised. The major expenditure was met with from the donation given by
        M/s RANE group, Chennai. Presently old and rare books(more than 100-200
        years old) are being digitised. Once the digitisation is done, the
        Institute would upload the digitised books/manuscripts.”
      </v-card>
    </v-card>
  </div>
</template>

<script setup>
const description =
  "KSRI has already digitalized the entire collection of palm leaf manuscripts and paper manuscripts. Around 1100 old and rare books have also been digitalized.";

useSeoMeta({
  title: "KSRI Library Online",
  description: description,
  ogTitle: "KSRI Library Online",
  ogDescription: description,
  twitterTitle: "KSRI Library Online",
  twitterDescription: description,
});
</script>
<style scoped>
.onlineLibBg {
  background-image: url("/img/library/library-racks-1.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
