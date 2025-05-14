<template>
  <div>
    <v-btn
      :color="buttonColor"
      @click="openReader"
      :loading="loading"
      rounded="pill"
      class="my-4"
    >
      {{ props.buttonText }}
    </v-btn>

    <v-dialog
      v-model="showReader"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <v-toolbar dark color="primary">
        <div class="d-flex">
          <!-- close dialog -->
          <v-spacer />
          <v-btn
            icon
            @click="showReader = false"
            class="mr-2"
            :loading="loading"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-toolbar>

      <v-card class="pa-0" elevation="4">
        <v-card-text>
          <v-row>
            <!-- Viewer -->
            <v-col>
              <div
                class="epub-reader-wrapper"
                style="height: 100vh; position: relative"
              >
                <v-no-ssr>
                  <vue-reader
                    :url="src"
                    :location.sync="location"
                    :getRendition="getRendition"
                    @update:location="locationChange"
                    :epubInitOptions="{ openAs: 'epub' }"
                  />
                </v-no-ssr>
                <!-- <div class="size">
              <button @click="changeSize(Math.max(80, size - 10))">-</button>
              <span>Current size: {{ size }}%</span>
              <button @click="changeSize(Math.min(130, size + 10))">+</button>
            </div> -->
              </div>
              <div class="d-flex justify-space-between mt-2">
                <div>page {{ page }}</div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { VueReader } from "vue-reader/lib/vue-reader.es.js";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    default: "Preview Book",
  },
  buttonColor: {
    type: String,
    default: "secondary",
  },
});

let location = ref(null);
let rendition = null;
let toc = ref([]);
let page = ref("");
let size = ref(100);
let showReader = ref(false);
let loading = ref(false);

const openReader = () => {
  showReader.value = true;
};

// Change function name from onRenditionCreated to getRendition to match reference code
const getRendition = (rend) => {
  rendition = rend;

  // Apply font size immediately after getting rendition
  if (rendition) {
    rendition.themes.fontSize(`${size.value}%`);
  }

  rendition.book.loaded.navigation.then((nav) => {
    toc.value = nav.toc;
  });
};

const changeSize = (val) => {
  size.value = val;
  // Make sure rendition exists and is not null before accessing themes
  if (rendition && rendition.themes) {
    rendition.themes.fontSize(`${val}%`);
  }
};

const getLabel = (toc, href) => {
  let label = "n/a";
  toc.some((item) => {
    if (item.subitems.length > 0) {
      const subChapter = getLabel(item.subitems, href);
      if (subChapter !== "n/a") {
        label = subChapter;
        return true;
      }
    } else if (item.href.includes(href)) {
      label = item.label;
      return true;
    }
  });
  return label;
};

const locationChange = (epubcifi) => {
  if (epubcifi && rendition) {
    const { displayed, href } = rendition.location.start;
    const label = getLabel(toc.value, href);
    page.value = `${displayed.page}/${displayed.total} ${label}`;
  }
};

const goToSection = (href) => {
  if (rendition) {
    rendition.display(href);
  }
};

const nextPage = () => {
  if (rendition) rendition.next();
};

const prevPage = () => {
  if (rendition) rendition.prev();
};
</script>

<style scoped>
.epub-reader-wrapper {
  border: 1px solid #ccc;
  height: 500px;
  overflow: hidden;
  position: relative;
}

.toc-panel {
  border-right: 1px solid #ccc;
  max-height: 500px;
  overflow-y: auto;
}

.size {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  left: 1rem;
  z-index: 1;
  text-align: center;
  color: #000;
}
</style>
