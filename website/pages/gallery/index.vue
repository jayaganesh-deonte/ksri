<template>
  <div>
    <!-- Main Gallery View -->
    <div v-if="currentView === 'main'">
      <div class="ma-2">
        <section-title title="Gallery" />
      </div>
      <div
        class="d-flex justify-center ma-2"
        :class="$device.isMobile ? 'flex-column' : 'flex-wrap'"
      >
        <div v-for="subsection in collections" :key="subsection">
          <albumPreview
            :albumName="subsection"
            :images="galleryImages[subsection]"
            @view-album="handleViewAlbum"
          />
        </div>
      </div>
    </div>

    <!-- Sub-Collections View -->
    <div v-else-if="currentView === 'subCollections'">
      <div class="d-flex justify-center align-center ma-2">
        <!-- Back Button -->
        <v-btn
          icon
          variant="text"
          color="secondary"
          class="mr-4"
          @click="goBack"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <div class="text-h4 text-secondary font-weight-bold">
          {{ currentAlbum }}
        </div>
      </div>

      <!-- Sub-Collections Grid -->
      <div class="d-flex flex-row flex-wrap justify-center">
        <div
          v-for="subCollection in currentSubCollections"
          :key="subCollection"
          class="ma-2"
        >
          <albumPreview
            :albumName="subCollection"
            :images="getSubCollectionImages(subCollection)"
            @view-album="viewAlbum"
          />
        </div>
      </div>
    </div>

    <!-- Single Album View -->
    <div v-else-if="currentView === 'album'">
      <div class="d-flex justify-center align-center ma-2">
        <!-- Back Button -->
        <v-btn
          icon
          variant="text"
          color="secondary"
          class="mr-4"
          @click="goBack"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <div class="text-h4 text-center text-secondary font-weight-bold">
          {{ currentAlbum }}
        </div>
      </div>

      <div class="d-flex flex-row flex-wrap justify-center">
        <div v-for="image in selectedAlbumImages" :key="image.id">
          <galleryCard :image="image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import galleryCard from "~/components/gallery/galleryCard.vue";
import albumPreview from "~/components/gallery/albumPreview.vue";

// SEO Meta
useSeoMeta({
  title: "Gallery",
  description: "Photo Gallery",
  ogTitle: "Gallery",
  ogDescription: "Photo Gallery",
  twitterTitle: "Gallery",
  twitterDescription: "Photo Gallery",
});

// Data Fetching
const collectionsData = await queryContent("gallery", "collections").findOne();
const collections = collectionsData.body;

const galleryData = await queryContent("gallery", "gallery").findOne();
const images = galleryData.body;

// Prepare gallery images
const galleryImages = ref({});
collections.forEach((collection) => {
  galleryImages.value[collection] = [];
  images.forEach((image) => {
    if (image.collection === collection) {
      galleryImages.value[collection].push(image);
    }
  });
});

// Navigation Stack Management
const navigationStack = ref([]);
const currentView = ref("main");
const currentAlbum = ref(null);
const currentSubCollections = ref([]);
const selectedAlbumImages = ref([]);

// View Handlers
const handleViewAlbum = (albumInfo) => {
  // Push current state to navigation stack
  navigationStack.value.push({
    view: currentView.value,
    album: currentAlbum.value,
    subCollections: currentSubCollections.value,
    selectedImages: selectedAlbumImages.value,
  });

  if (typeof albumInfo === "string") {
    // Simple album view
    currentAlbum.value = albumInfo;
    currentView.value = "album";
    selectedAlbumImages.value = galleryImages.value[albumInfo];
    window.scrollTo(0, 0);
  } else {
    // Sub-collections view
    currentAlbum.value = albumInfo.albumName;
    currentSubCollections.value = albumInfo.subCollections;
    currentView.value = "subCollections";
    selectedAlbumImages.value = [];
    window.scrollTo(0, 0);
  }
};

const viewAlbum = (subCollection) => {
  // Push current state to navigation stack
  navigationStack.value.push({
    view: currentView.value,
    album: currentAlbum.value,
    subCollections: currentSubCollections.value,
    selectedImages: selectedAlbumImages.value,
  });

  // Store the parent album name before updating currentAlbum
  const parentAlbum = currentAlbum.value;
  currentAlbum.value = subCollection;
  currentView.value = "album";

  // Filter images for this specific sub-collection using the parent album
  selectedAlbumImages.value = images.filter(
    (image) =>
      image.collection === parentAlbum && image.subCollection === subCollection
  );

  window.scrollTo(0, 0);
};

const goBack = () => {
  if (navigationStack.value.length > 0) {
    const previousState = navigationStack.value.pop();

    // Restore previous state
    currentView.value = previousState.view || "main";
    currentAlbum.value = previousState.album;
    currentSubCollections.value = previousState.subCollections || [];
    selectedAlbumImages.value = previousState.selectedImages || [];

    window.scrollTo(0, 0);
  }
};

const getSubCollectionImages = (subCollection) => {
  return images
    .filter(
      (image) =>
        image.collection === currentAlbum.value &&
        image.subCollection === subCollection
    )
    .slice(0, 4);
};

// Initialize view
onMounted(() => {
  currentView.value = "main";
  currentAlbum.value = null;
  currentSubCollections.value = [];
  selectedAlbumImages.value = [];
});
</script>
