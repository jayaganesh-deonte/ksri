<template>
  <v-card class="pa-4" elevation="4">
    <v-card-text>
      <v-row>
        <!-- Viewer -->
        <v-col>
          <div class="epub-reader-wrapper">
            <vue-reader
              :url="src"
              :location.sync="location"
              :getRendition="onRenditionCreated"
            />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, watch } from "vue";
import { VueReader } from "vue-reader";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
});

const location = ref(null);
const rendition = ref(null);
const toc = ref([]);

const onRenditionCreated = (rend) => {
  rendition.value = rend;

  rendition.value.book.loaded.navigation.then((nav) => {
    toc.value = nav.toc;
  });
};

const goToSection = (href) => {
  if (rendition.value) {
    rendition.value.display(href);
  }
};

const nextPage = () => {
  if (rendition.value) rendition.value.next();
};

const prevPage = () => {
  if (rendition.value) rendition.value.prev();
};
</script>

<style scoped>
.epub-reader-wrapper {
  border: 1px solid #ccc;
  height: 500px;
  overflow: hidden;
}

.toc-panel {
  border-right: 1px solid #ccc;
  max-height: 500px;
  overflow-y: auto;
}
</style>
