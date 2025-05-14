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
        <v-card-text @contextmenu.prevent>
          <v-row>
            <!-- Viewer -->
            <v-col>
              <div
                class="epub-reader-wrapper no-select"
                style="height: 100vh; position: relative"
                @contextmenu.prevent
              >
                <v-no-ssr>
                  <vue-reader
                    :url="src"
                    :location.sync="location"
                    :getRendition="getRendition"
                    @update:location="locationChange"
                    :epubInitOptions="{ openAs: 'epub' }"
                    ref="epubReader"
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
import { ref, watch, onMounted, onUnmounted } from "vue";
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
const epubReader = ref(null);

const openReader = () => {
  showReader.value = true;
};

// Change function name from onRenditionCreated to getRendition to match reference code
const getRendition = (rend) => {
  rendition = rend;

  // Apply font size immediately after getting rendition
  if (rendition) {
    rendition.themes.fontSize(`${size.value}%`);

    // Add CSS to prevent text selection in the EPUB content
    rendition.themes.register("default", {
      body: {
        "-webkit-user-select": "none",
        "-moz-user-select": "none",
        "-ms-user-select": "none",
        "user-select": "none",
      },
      img: {
        "pointer-events": "none",
      },
    });

    // Apply the registered theme
    rendition.themes.select("default");

    // Disable copying text
    rendition.on("selected", (cfiRange, contents) => {
      contents.window.getSelection().removeAllRanges();
    });

    // Prevent context menu in iframe content
    rendition.hooks.content.register((contents) => {
      contents.window.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        return false;
      });

      // Prevent drag events in the content
      contents.window.addEventListener("dragstart", (e) => {
        e.preventDefault();
        return false;
      });

      // Prevent keyboard shortcuts in the content
      contents.window.addEventListener("keydown", (e) => {
        if (
          (e.ctrlKey || e.metaKey) &&
          (e.key === "s" || e.key === "p" || e.key === "c")
        ) {
          e.preventDefault();
          return false;
        }
      });
    });
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

// Prevent keyboard shortcuts for saving (Ctrl+S, Command+S, Ctrl+P, etc.)
const preventSave = (e) => {
  if (
    (e.ctrlKey || e.metaKey) &&
    (e.key === "s" || e.key === "p" || e.key === "c")
  ) {
    e.preventDefault();
    return false;
  }
};

// Prevent right-click menu globally when dialog is open
const preventContextMenu = (e) => {
  if (showReader.value) {
    e.preventDefault();
    return false;
  }
};

// Disable drag and drop
const preventDragStart = (e) => {
  if (showReader.value) {
    e.preventDefault();
    return false;
  }
};

// Set up and tear down event listeners based on dialog visibility
watch(showReader, (isVisible) => {
  if (isVisible) {
    document.addEventListener("keydown", preventSave);
    document.addEventListener("dragstart", preventDragStart);
  } else {
    document.removeEventListener("keydown", preventSave);
    document.removeEventListener("dragstart", preventDragStart);
  }
});

onMounted(() => {
  // Add the event listener for the entire document when the component is mounted
  document.addEventListener("contextmenu", preventContextMenu);
});

onUnmounted(() => {
  // Clean up event listeners when the component is unmounted
  document.removeEventListener("contextmenu", preventContextMenu);
  document.removeEventListener("keydown", preventSave);
  document.removeEventListener("dragstart", preventDragStart);
});
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

/* CSS to prevent text selection and image saving */
.no-select {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Additional styles to prevent selection in the EPUB content */
:deep(.epub-container) {
  user-select: none !important;
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
}

:deep(.epub-container iframe) {
  pointer-events: auto; /* Allow scrolling but prevent other interactions */
}

:deep(.epub-container img) {
  pointer-events: none !important; /* Prevent image drag/save */
}
</style>
