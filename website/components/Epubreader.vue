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
        <div class="d-flex align-center w-100">
          <v-spacer />
          <!-- Bookmark current location button -->
          <v-tooltip
            location="bottom"
            text="Bookmark this page"
            v-if="displayBookMark"
          >
            <template v-slot:activator="{ props: tooltipProps }">
              <v-btn
                icon
                v-bind="tooltipProps"
                @click="toggleBookmark"
                class="mr-2"
                :disabled="loading"
              >
                <v-icon>
                  {{
                    isCurrentLocationBookmarked
                      ? "mdi-bookmark"
                      : "mdi-bookmark-outline"
                  }}
                </v-icon>
              </v-btn>
            </template>
          </v-tooltip>

          <!-- Bookmarks list button -->
          <v-menu v-if="displayBookMark">
            <template v-slot:activator="{ props: menuProps }">
              <v-btn icon v-bind="menuProps" class="mr-2" :disabled="loading">
                <v-icon>mdi-bookmark-multiple</v-icon>
              </v-btn>
            </template>
            <v-card min-width="300" class="bookmarks-menu">
              <v-card-title class="d-flex justify-space-between">
                <span>Bookmarks</span>
                <v-btn
                  v-if="bookmarks.length > 0"
                  density="compact"
                  variant="text"
                  color="error"
                  size="small"
                  @click="clearAllBookmarks"
                >
                  Clear All
                </v-btn>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="pa-0">
                <v-list v-if="bookmarks.length > 0">
                  <v-list-item
                    v-for="bookmark in bookmarks"
                    :key="bookmark.cfi"
                    @click="goToBookmarkedLocation(bookmark.cfi)"
                  >
                    <template v-slot:prepend>
                      <v-icon>mdi-bookmark</v-icon>
                    </template>
                    <v-list-item-title>
                      {{ bookmark.chapterTitle }}
                    </v-list-item-title>
                    <v-list-item-subtitle
                      v-if="bookmark.note"
                      class="text-truncate"
                    >
                      {{ bookmark.note }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle
                      v-if="bookmark.excerpt"
                      class="text-truncate text-caption"
                    >
                      {{ bookmark.excerpt }}
                    </v-list-item-subtitle>
                    <template v-slot:append>
                      <div class="d-flex">
                        <v-icon
                          size="small"
                          class="mr-2"
                          @click.stop="editBookmarkNote(bookmark)"
                        >
                          mdi-pencil
                        </v-icon>
                        <v-icon
                          size="small"
                          @click.stop="removeBookmark(bookmark.cfi)"
                        >
                          mdi-close
                        </v-icon>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
                <div v-else class="pa-4 text-center text-grey">
                  No bookmarks yet
                </div>
              </v-card-text>
            </v-card>
          </v-menu>

          <!-- Close dialog -->
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

      <!-- Bookmark Note Dialog -->
      <v-dialog v-model="bookmarkNoteDialog" max-width="500px">
        <v-card>
          <v-card-title>
            {{ editingBookmark ? "Edit Bookmark Note" : "Add Bookmark Note" }}
          </v-card-title>
          <v-card-text>
            <v-textarea
              v-model="bookmarkNote"
              label="Note (max 100 words)"
              variant="outlined"
              counter
              :error-messages="bookmarkNoteError"
              rows="5"
              auto-grow
            ></v-textarea>
            <div class="text-caption">
              Words:
              {{
                bookmarkNote
                  .trim()
                  .split(/\s+/)
                  .filter((word) => word.length > 0).length
              }}/100
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="grey-darken-1"
              variant="text"
              @click="cancelBookmarkNote"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              variant="text"
              @click="
                editingBookmark ? confirmEditBookmark() : confirmAddBookmark()
              "
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
                <div>{{ pageInfo }}</div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
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
  bookId: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    default: "",
  },
  displayBookMark: {
    type: Boolean,
    default: true,
  },
});

let location = ref(null);
let rendition = ref(null);
let book = ref(null);
let toc = ref([]);
let pageInfo = ref("");
let size = ref(100);
let showReader = ref(false);
let loading = ref(false);
const epubReader = ref(null);

// Bookmark related state
const bookmarks = ref([]);
const bookmarkNoteDialog = ref(false);
const bookmarkNote = ref("");
const bookmarkNoteError = ref("");
const editingBookmark = ref(null);
const currentExcerpt = ref("");

// Check if current location is bookmarked
const isCurrentLocationBookmarked = computed(() => {
  if (!location.value) return false;
  return bookmarks.value.some((bookmark) => bookmark.cfi === location.value);
});

// Local storage key for bookmarks
const getBookmarksKey = computed(() => {
  return `epub-bookmarks-${props.userEmail}-${props.bookId}`;
});

// Load bookmarks from local storage
const loadBookmarks = () => {
  const savedBookmarks = localStorage.getItem(getBookmarksKey.value);
  if (savedBookmarks) {
    try {
      bookmarks.value = JSON.parse(savedBookmarks);
    } catch (e) {
      console.error("Error loading bookmarks:", e);
      bookmarks.value = [];
    }
  }
};

// Save bookmarks to local storage
const saveBookmarks = () => {
  localStorage.setItem(getBookmarksKey.value, JSON.stringify(bookmarks.value));
};

const openReader = () => {
  showReader.value = true;
  loadBookmarks();
};

// Extract text from the current page for bookmark context
const extractCurrentText = () => {
  if (!rendition.value) return "";

  // Try to get current content
  try {
    const iframe = document.querySelector("iframe.epub-view");
    if (iframe && iframe.contentDocument) {
      const textContent = iframe.contentDocument.body.textContent || "";
      // Extract a short excerpt (first 100 characters)
      return (
        textContent.trim().substring(0, 100) +
        (textContent.length > 100 ? "..." : "")
      );
    }
  } catch (e) {
    console.error("Failed to extract text:", e);
  }

  return "";
};

// Get the current chapter title
const getCurrentChapterTitle = () => {
  if (!location.value || !toc.value.length) return " ";

  // Find the closest TOC entry to current location
  let currentChapter = " ";

  if (rendition.value && rendition.value.location) {
    const { href } = rendition.value.location.start;
    const matchingTocItem = findTocItemByHref(toc.value, href);
    if (matchingTocItem) {
      currentChapter = matchingTocItem.label;
    }
  }

  return currentChapter;
};

// Helper to find TOC item by href
const findTocItemByHref = (tocItems, href) => {
  for (const item of tocItems) {
    if (item.href && href.includes(item.href)) {
      return item;
    }

    if (item.subitems && item.subitems.length > 0) {
      const subItem = findTocItemByHref(item.subitems, href);
      if (subItem) return subItem;
    }
  }

  return null;
};

// Bookmark methods
const toggleBookmark = () => {
  if (!location.value) return;

  if (isCurrentLocationBookmarked.value) {
    removeBookmark(location.value);
  } else {
    addBookmarkWithNote();
  }
};

const addBookmarkWithNote = () => {
  if (!location.value) return;

  // Get text excerpt from current position
  currentExcerpt.value = extractCurrentText();

  // Open dialog to add note
  bookmarkNoteDialog.value = true;
  bookmarkNote.value = "";
  editingBookmark.value = null;
};

const confirmAddBookmark = () => {
  // Validate note length (100 words max)
  const wordCount = bookmarkNote.value
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  if (wordCount > 100) {
    bookmarkNoteError.value = "Note exceeds 100 words limit";
    return;
  }

  // Add the bookmark with note
  addBookmark(location.value, bookmarkNote.value, currentExcerpt.value);

  // Reset and close dialog
  bookmarkNote.value = "";
  bookmarkNoteError.value = "";
  bookmarkNoteDialog.value = false;
};

const addBookmark = (cfi, note = "", excerpt = "") => {
  const chapterTitle = getCurrentChapterTitle();

  bookmarks.value.push({
    cfi,
    chapterTitle,
    note,
    excerpt,
    date: new Date().toISOString(),
  });

  saveBookmarks();
};

const removeBookmark = (cfi) => {
  bookmarks.value = bookmarks.value.filter((bookmark) => bookmark.cfi !== cfi);
  saveBookmarks();
};

const clearAllBookmarks = () => {
  bookmarks.value = [];
  saveBookmarks();
};

const editBookmarkNote = (bookmark) => {
  editingBookmark.value = bookmark;
  bookmarkNote.value = bookmark.note || "";
  bookmarkNoteDialog.value = true;
};

const confirmEditBookmark = () => {
  // Validate note length (100 words max)
  const wordCount = bookmarkNote.value
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  if (wordCount > 100) {
    bookmarkNoteError.value = "Note exceeds 100 words limit";
    return;
  }

  // Update the bookmark note
  const index = bookmarks.value.findIndex(
    (b) => b.cfi === editingBookmark.value.cfi
  );

  if (index !== -1) {
    bookmarks.value[index].note = bookmarkNote.value;
    saveBookmarks();
  }

  // Reset and close dialog
  bookmarkNote.value = "";
  bookmarkNoteError.value = "";
  bookmarkNoteDialog.value = false;
  editingBookmark.value = null;
};

const cancelBookmarkNote = () => {
  bookmarkNote.value = "";
  bookmarkNoteError.value = "";
  bookmarkNoteDialog.value = false;
  editingBookmark.value = null;
};

// Navigate to a bookmarked location
const goToBookmarkedLocation = (cfi) => {
  if (rendition.value) {
    rendition.value.display(cfi);
  }
};

// Change function name from onRenditionCreated to getRendition to match reference code
const getRendition = (rend) => {
  rendition.value = rend;
  book.value = rend.book;

  // Apply font size immediately after getting rendition
  if (rendition.value) {
    rendition.value.themes.fontSize(`${size.value}%`);

    // Add CSS to prevent text selection in the EPUB content
    rendition.value.themes.register("default", {
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
    rendition.value.themes.select("default");

    // Disable copying text
    rendition.value.on("selected", (cfiRange, contents) => {
      contents.window.getSelection().removeAllRanges();
    });

    // Prevent context menu in iframe content
    rendition.value.hooks.content.register((contents) => {
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

  rend.book.loaded.navigation.then((nav) => {
    toc.value = nav.toc;
  });
};

const changeSize = (val) => {
  size.value = val;
  // Make sure rendition exists and is not null before accessing themes
  if (rendition.value && rendition.value.themes) {
    rendition.value.themes.fontSize(`${val}%`);
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
  location.value = epubcifi;

  if (epubcifi && rendition.value) {
    const { displayed, href } = rendition.value.location.start;
    const label = getLabel(toc.value, href);
    pageInfo.value = `${displayed.page}/${displayed.total} ${label}`;
  }
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

/* Bookmarks menu styling */
.bookmarks-menu {
  max-height: 400px;
  overflow-y: auto;
}
</style>
