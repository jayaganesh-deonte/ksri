<template>
  <v-card class="pdf-reader-card">
    <v-card-title class="pdf-title">
      <v-icon start color="primary" class="mr-2">mdi-file-pdf-box</v-icon>
      PDF Viewer
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pdf-container">
      <div class="loading-container" v-if="!isLoaded">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
        <span class="ml-3">Loading PDF...</span>
      </div>

      <VuePDF
        :key="page"
        :pdf="pdf"
        :page="page"
        :text-layer="false"
        :scale="zoom"
        @loaded="isLoaded = true"
        class="pdf-content"
      />
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="pdf-controls">
      <v-btn
        prepend-icon="mdi-arrow-left"
        variant="tonal"
        color="primary"
        :disabled="page <= 1"
        @click="page--"
        class="mr-2"
      >
        Previous
      </v-btn>

      <v-text-field
        v-model="pageInput"
        hide-details
        type="number"
        density="compact"
        class="page-input mx-2"
        style="max-width: 70px"
        @change="goToPage"
        @keyup.enter="goToPage"
      ></v-text-field>

      <span class="page-info mx-2">of {{ pages }}</span>

      <v-btn
        append-icon="mdi-arrow-right"
        variant="tonal"
        color="primary"
        :disabled="page >= pages"
        @click="page++"
        class="ml-2"
      >
        Next
      </v-btn>

      <v-spacer></v-spacer>

      <v-tooltip location="top" text="Zoom Out">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-magnify-minus"
            variant="text"
            :disabled="zoom <= 0.5"
            @click="zoomOut"
          ></v-btn>
        </template>
      </v-tooltip>

      <span class="zoom-level mx-2">{{ Math.round(zoom * 100) }}%</span>

      <v-tooltip location="top" text="Zoom In">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-magnify-plus"
            variant="text"
            :disabled="zoom >= 2"
            @click="zoomIn"
          ></v-btn>
        </template>
      </v-tooltip>

      <v-divider vertical class="mx-2"></v-divider>

      <!-- Removed text layer and download buttons -->
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { VuePDF, usePDF } from "@tato30/vue-pdf";

// Props
const props = defineProps({
  pdfUrl: {
    type: String,
    required: true,
  },
  initialZoom: {
    type: Number,
    default: 1,
  },
});

// State
const page = ref(1);
const zoom = ref(props.initialZoom);
const isLoaded = ref(false);

// Computed
const pageInput = computed({
  get: () => page.value,
  set: (val) => val, // Only set in goToPage method
});

// PDF loading
const { pdf, pages } = usePDF(props.pdfUrl);

// Methods
const goToPage = () => {
  const newPage = parseInt(pageInput.value);
  if (!isNaN(newPage) && newPage > 0 && newPage <= pages.value) {
    page.value = newPage;
  } else {
    pageInput.value = page.value;
  }
};

const zoomIn = () => {
  if (zoom.value < 2) {
    zoom.value = Math.min(2, zoom.value + 0.1);
  }
};

const zoomOut = () => {
  if (zoom.value > 0.5) {
    zoom.value = Math.max(0.5, zoom.value - 0.1);
  }
};
</script>

<style scoped>
.pdf-reader-card {
  max-width: 100%;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pdf-title {
  font-weight: 500;
  font-size: 1.1rem;
  padding: 12px 16px;
}

.pdf-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  background-color: #f5f5f5;
  position: relative;
  padding: 16px 0;
  overflow: auto;
}

.loading-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pdf-content {
  max-width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
}

.pdf-controls {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  background-color: #fafafa;
}

.page-info {
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.6);
}

.zoom-level {
  font-size: 0.9rem;
  min-width: 48px;
  text-align: center;
}

/* PDF content styling */
.pdf-content {
  max-width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
}
</style>
