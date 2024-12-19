<template>
  <div>
    <div v-for="subsection in collections" :key="subsection">
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
        <div v-for="image in galleryImages[subsection]" :key="image" class="">
          <galleryCard :image="image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: "Gallery",
  description: "Gallery",
  ogTitle: "Gallery",
  ogDescription: "Gallery",
  twitterTitle: "Gallery",
  twitterDescription: "Gallery",
});

import galleryCard from "~/components/gallery/galleryCard.vue";

const collectionsData = await queryContent("gallery", "collections").findOne();

const collections = collectionsData.body;

console.log("collections", collections);

const galleryData = await queryContent("gallery", "gallery").findOne();

console.log("galleryData", galleryData.body);

const images = galleryData.body;

console.log("images", images);

let galleryImages = {};

collections.forEach((collection) => {
  galleryImages[collection] = [];
  images.forEach((image) => {
    if (image.collection === collection) {
      galleryImages[collection].push(image);
    }
  });
});
console.log("galleryImages", galleryImages);
</script>
