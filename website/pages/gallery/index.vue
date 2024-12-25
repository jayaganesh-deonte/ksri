<template>
  <div>
    <div v-if="!viewAlbumName">
      <div class="ma-2">
        <section-title title="Gallery" />
      </div>
      <div class="d-flex flex-wrap ma-2">
        <div v-for="subsection in collections" :key="subsection">
          <!-- album card with 4 images and then  name of the collection below -->
          <albumPreview
            :albumName="subsection"
            :images="galleryImages[subsection].slice(0, 4)"
            @view-album="viewAlbum(subsection)"
          />
        </div>
      </div>
    </div>

    <div v-else>
      <!-- display album name -->
      <!-- back to all albums -->
      <div class="text-center ma-2">
        <v-btn
          rounded="pill"
          color="secondary"
          variant="outlined"
          @click="viewAlbumName = false"
        >
          View All Albums
        </v-btn>
      </div>
      <div class="ma-2">
        <div class="text-h4 text-center text-secondary font-weight-bold">
          {{ selectedAlbum }}
        </div>
      </div>

      <div class="d-flex flex-row flex-wrap justify-center">
        <div v-for="image in galleryImages[selectedAlbum]" :key="image">
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
import albumPreview from "~/components/gallery/albumPreview.vue";

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

let selectedAlbum = ref(null);
let viewAlbumName = ref(false);

const viewAlbum = (album) => {
  selectedAlbum.value = album;
  viewAlbumName.value = true;
};
</script>
