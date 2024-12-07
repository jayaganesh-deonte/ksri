<template>
  <div>
    <div v-for="subsection in gallerySubsections" :key="subsection">
      <v-card
        class="mb-6 text-center"
        rounded="0"
        elevation="0"
        color="greenBg"
      >
        <v-card-title class="text-h5 font-weight-bold">
          {{ subsection }}
        </v-card-title>
      </v-card>

      <!-- display images -->
      <div class="d-flex flex-row flex-wrap justify-center">
        <div v-for="image in gallery[subsection]" :key="image" class="">
          <galleryCard :image="image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import galleryCard from "~/components/gallery/galleryCard.vue";

const galleryData = await queryContent("gallery").findOne();
console.log("gallery", galleryData);

const gallery = galleryData.gallery;

const gallerySubsections = Object.keys(gallery);
</script>
