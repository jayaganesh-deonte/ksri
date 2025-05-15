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
          <v-spacer></v-spacer>

          <!-- Bookmark current page button -->
          <v-tooltip
            location="bottom"
            text="Bookmark this page"
            v-if="displayBookMark"
          >
            <template v-slot:activator="{ props: tooltipProps }">
              <v-btn icon v-bind="tooltipProps" @click="toggleBookmark(page)">
                <v-icon>
                  {{
                    isCurrentPageBookmarked
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
              <v-btn icon v-bind="menuProps" class="ml-2">
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
                    :key="bookmark.page"
                    @click="goToBookmarkedPage(bookmark.page)"
                  >
                    <template v-slot:prepend>
                      <v-icon>mdi-bookmark</v-icon>
                    </template>
                    <v-list-item-title>
                      Page {{ bookmark.page }}
                    </v-list-item-title>
                    <v-list-item-subtitle
                      v-if="bookmark.note"
                      class="text-truncate"
                    >
                      {{ bookmark.note }}
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
                          @click.stop="removeBookmark(bookmark.page)"
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

          <v-btn icon @click="dialogVisible = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
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
                @click="cancelAddBookmark"
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

        <v-card-text class="pdf-container" @contextmenu.prevent>
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
            class="pdf-content mx-auto no-select"
            ref="pdfContent"
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
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { VuePDF, usePDF } from "@tato30/vue-pdf";

import { userStore } from "~/stores/UserStore";

const store = userStore();

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
  bookId: {
    type: String,
  },
  displayBookMark: {
    type: Boolean,
    default: true,
  },
});

// State
const page = ref(1);
const zoom = ref(props.initialZoom);
const isLoaded = ref(false);
const dialogVisible = ref(false);
const pdfContent = ref(null);
const bookmarks = ref([]);
const bookmarkNoteDialog = ref(false);
const bookmarkNote = ref("");
const bookmarkNoteError = ref("");
const bookmarkPageToAdd = ref(null);
const editingBookmark = ref(null);

// Computed
const pageInput = computed({
  get: () => page.value,
  set: (val) => val, // Only set in goToPage method
});

// Check if current page is bookmarked
const isCurrentPageBookmarked = computed(() => {
  return bookmarks.value.some((bookmark) => bookmark.page === page.value);
});

// PDF loading - only load when dialog is opened
const { pdf, pages } = usePDF(props.pdfUrl);

// Local storage key for bookmarks
const getBookmarksKey = computed(() => {
  let userEmail = "";
  if (store.isAuthenticated) {
    userEmail = store.userEmail;
  }
  return `pdf-bookmarks-${userEmail}-${props.bookId}`;
});

// Load bookmarks from local storage
const loadBookmarks = async () => {
  const savedBookmarks = await store.getBookMarks(props.bookId);
  if (savedBookmarks) {
    try {
      bookmarks.value = savedBookmarks;
    } catch (e) {
      console.error("Error loading bookmarks:", e);
      bookmarks.value = [];
    }
  }
};

// Save bookmarks to local storage
const saveBookmarks = async () => {
  try {
    const res = await store.saveBookMarks(props.bookId, bookmarks.value);
  } catch (e) {
    console.error("Error saving bookmarks:", e);
  }
};

// Bookmark methods
const toggleBookmark = async (pageNum) => {
  if (isCurrentPageBookmarked.value) {
    await removeBookmark(pageNum);
  } else {
    addBookmarkWithNote(pageNum);
  }
};

// Function to navigate to bookmarked page
const goToBookmarkedPage = (pageNum) => {
  page.value = pageNum;
  // Close the menu after navigating
  // This is optional, but provides a better UX
};

const addBookmarkWithNote = (pageNum) => {
  // Check if already exists
  if (!bookmarks.value.some((bookmark) => bookmark.page === pageNum)) {
    // Open dialog to add note
    bookmarkNoteDialog.value = true;
    bookmarkPageToAdd.value = pageNum;
  }
};

const addBookmark = async (pageNum, note = "") => {
  bookmarks.value.push({
    page: pageNum,
    note: note,
    date: new Date().toISOString(),
  });
  await saveBookmarks();
};

const removeBookmark = async (pageNum) => {
  bookmarks.value = bookmarks.value.filter(
    (bookmark) => bookmark.page !== pageNum
  );
  await saveBookmarks();
};

const clearAllBookmarks = async () => {
  bookmarks.value = [];
  await saveBookmarks();
};

const confirmAddBookmark = async () => {
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
  await addBookmark(bookmarkPageToAdd.value, bookmarkNote.value);

  // Reset and close dialog
  bookmarkNote.value = "";
  bookmarkNoteError.value = "";
  bookmarkNoteDialog.value = false;
  bookmarkPageToAdd.value = null;
};

const cancelAddBookmark = () => {
  bookmarkNote.value = "";
  bookmarkNoteError.value = "";
  bookmarkNoteDialog.value = false;
  bookmarkPageToAdd.value = null;
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
    (b) => b.page === editingBookmark.value.page
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

// Methods
const openPdfDialog = async () => {
  dialogVisible.value = true;
  // Reset state when opening
  page.value = 1;
  isLoaded.value = false;
  // Load bookmarks when dialog opens
  await loadBookmarks();
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

// Prevent keyboard shortcuts for saving (Ctrl+S, Command+S)
const preventSave = (e) => {
  if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "p")) {
    e.preventDefault();
    return false;
  }
};

// Prevent right-click menu globally when dialog is open
const preventContextMenu = (e) => {
  if (dialogVisible.value) {
    e.preventDefault();
    return false;
  }
};

// Disable drag and drop
const preventDragStart = (e) => {
  if (dialogVisible.value) {
    e.preventDefault();
    return false;
  }
};

// Set up and tear down event listeners
watch(dialogVisible, (isVisible) => {
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
  /* Added to prevent context menu */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
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

/* CSS to prevent text selection and image saving */
.no-select {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  pointer-events: none; /* This disables mouse interactions except for scroll */
}

/* Re-enable pointer events for scrolling */
.pdf-container {
  pointer-events: auto;
}

/* Bookmarks menu styling */
.bookmarks-menu {
  max-height: 400px;
  overflow-y: auto;
}

/* Word counter styles */
.word-counter {
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.6);
  text-align: right;
  margin-top: 4px;
}
</style>
