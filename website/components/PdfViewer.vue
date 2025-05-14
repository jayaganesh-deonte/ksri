<template>
  <!-- Main component with "Read Book" button -->
  <div>
    <v-btn
      :color="buttonColor"
      @click="openPdfDialog"
      class="my-4"
      rounded="pill"
    >
      {{ props.buttonText }}
    </v-btn>

    <!-- PDF Viewer Dialog -->
    <v-dialog
      v-model="dialogVisible"
      fullscreen
      transition="dialog-bottom-transition"
      :retain-focus="false"
    >
      <v-card class="pdf-reader-card">
        <v-toolbar color="primary" density="compact">
          <v-btn icon @click="dialogVisible = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="text-white"></v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>

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
            class="pdf-content mx-auto"
          />
        </v-card-text>

        <v-divider></v-divider>

        <v-card>
          <v-row>
            <!-- Left side: Navigation controls -->
            <v-col cols="12" md="6">
              <div class="d-flex justify-center align-center">
                <v-btn
                  prepend-icon="mdi-arrow-left"
                  variant="tonal"
                  color="primary"
                  :disabled="page <= 1"
                  @click="page--"
                >
                </v-btn>

                <v-text-field
                  v-model="pageInput"
                  hide-details
                  variant="outlined"
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
                >
                </v-btn>
              </div>
            </v-col>

            <!-- Right side: Zoom controls -->
            <v-col cols="12" md="6">
              <div class="d-flex justify-center align-center">
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

                <span class="zoom-level mx-2"
                  >{{ Math.round(zoom * 100) }}%</span
                >

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
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-card>
    </v-dialog>
  </div>
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
  buttonText: {
    type: String,
    default: "Read Book",
  },
  buttonColor: {
    type: String,
    default: "secondary",
  },
});

// State
const page = ref(1);
const zoom = ref(props.initialZoom);
const isLoaded = ref(false);
const dialogVisible = ref(false);

// Computed
const pageInput = computed({
  get: () => page.value,
  set: (val) => val, // Only set in goToPage method
});

// PDF loading - only load when dialog is opened
const { pdf, pages } = usePDF(props.pdfUrl);

// Methods
const openPdfDialog = () => {
  dialogVisible.value = true;
  // Reset state when opening
  page.value = 1;
  isLoaded.value = false;
};

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
  display: flex;
  flex-direction: column;
  height: 100%;
}

.pdf-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
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
</style>
