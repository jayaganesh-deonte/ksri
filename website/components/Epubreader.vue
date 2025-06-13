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
      <!-- Dynamic Toolbar -->
      <v-toolbar
        dark
        color="primary"
        :height="toolbarHeight"
        v-if="displayToolBar"
        class="reader-toolbar"
      >
        <div class="d-flex align-center w-100">
          <v-spacer />

          <!-- full screen -->
          <v-tooltip location="bottom" text="Toggle fullscreen">
            <template v-slot:activator="{ props: tooltipProps }">
              <div class="d-flex flex-column justify-center align-center mx-4">
                <v-btn icon v-bind="tooltipProps" @click="fullscreen">
                  <v-icon>mdi-fullscreen</v-icon>
                </v-btn>
                <span class="text-subtitle-2 mt-n2"> Fullscreen</span>
              </div>
            </template>
          </v-tooltip>

          <!-- Bookmark current location button -->
          <v-tooltip
            location="bottom"
            text="Bookmark this page"
            v-if="displayBookMark"
          >
            <template v-slot:activator="{ props: tooltipProps }">
              <div class="d-flex flex-column justify-center align-center mx-2">
                <v-btn
                  icon
                  v-bind="tooltipProps"
                  @click="toggleBookmark"
                  :size="buttonSize"
                  :disabled="loading"
                >
                  <v-icon :size="iconSize">
                    {{
                      isCurrentLocationBookmarked
                        ? "mdi-bookmark"
                        : "mdi-bookmark-outline"
                    }}
                  </v-icon>
                </v-btn>
                <span class="text-caption mt-n1"> Bookmark </span>
              </div>
            </template>
          </v-tooltip>

          <!-- Bookmarks list button -->
          <v-menu
            v-if="displayBookMark"
            :class="isMobilePortrait ? 'mx-2' : 'mx-4'"
          >
            <template v-slot:activator="{ props: menuProps }">
              <div class="d-flex flex-column justify-center align-center">
                <v-btn
                  icon
                  v-bind="menuProps"
                  :size="buttonSize"
                  :disabled="loading"
                >
                  <v-icon :size="iconSize">mdi-bookmark-multiple</v-icon>
                </v-btn>
                <span class="text-caption mt-n1"> Bookmarks </span>
              </div>
            </template>
            <v-card :min-width="bookmarkMenuWidth" class="bookmarks-menu">
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
            @click="closeReader"
            :size="buttonSize"
            :loading="loading"
          >
            <v-icon :size="iconSize">mdi-close</v-icon>
          </v-btn>
        </div>
      </v-toolbar>

      <!-- Hide toolbar button -->
      <div
        :style="`position: absolute; top: ${toolbarHeight}px; right: 4px; z-index: 1000;`"
        v-if="displayToolBar"
      >
        <v-btn
          :size="buttonSize"
          color="primary"
          rounded="0"
          @click="displayToolBar = false"
        >
          <v-icon :size="iconSize">mdi-chevron-up</v-icon>
        </v-btn>
      </div>

      <!-- Show toolbar button -->
      <div
        style="position: absolute; top: 4px; right: 4px; z-index: 1000"
        v-if="!displayToolBar"
      >
        <v-btn
          class="toolbar-toggle-btn"
          color="primary"
          @click="displayToolBar = true"
          :icon="`mdi-chevron-down`"
          rounded="0"
          :size="buttonSize"
        >
        </v-btn>
      </div>

      <!-- Bookmark Note Dialog -->
      <v-dialog v-model="bookmarkNoteDialog" :max-width="dialogWidth">
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

      <!-- Main Reader Card -->
      <v-card class="pa-0 reader-main-card" elevation="4" color="primary">
        <v-card-text @contextmenu.prevent class="pa-0 ma-0">
          <div>
            <!-- Error Alert -->
            <div v-if="loadError" cols="12">
              <v-alert type="error" closable>
                {{ loadError }}
              </v-alert>
            </div>

            <!-- Loading Indicator -->
            <div v-if="loading" cols="12" class="text-center loading-container">
              <v-progress-circular
                indeterminate
                color="primary"
                :size="loadingSize"
              ></v-progress-circular>
              <div class="mt-4">Loading ebook...</div>
            </div>

            <!-- EPUB Viewer -->
            <v-card v-else class="ma-0 pa-0" :height="readerHeight">
              <div
                class="epub-reader-wrapper no-select"
                :style="`height: ${readerHeight} !important`"
                @contextmenu.prevent
              >
                <v-no-ssr>
                  <vue-reader
                    v-if="epubData"
                    :url="epubData"
                    :location.sync="location"
                    :getRendition="getRendition"
                    @update:location="locationChange"
                    ref="epubReader"
                    :epubOptions="epubOptions"
                  />
                </v-no-ssr>
              </div>
            </v-card>
          </div>

          <!-- Bottom Controls -->
          <v-card
            dark
            color="primary"
            class="text--white bottom-controls"
            v-if="displayToolBar"
            elevation="0"
          >
            <div :class="controlsLayoutClass">
              <!-- Progress Control -->
              <div class="progress-control">
                <div class="d-flex flex-column justify-center align-center">
                  <div class="d-flex align-center">
                    <span class="text-caption mr-2">{{ current }}%</span>
                    <input
                      type="range"
                      :value="current"
                      :min="0"
                      :max="100"
                      :step="1"
                      @change="changeProgress"
                      class="progress-slider"
                      :disabled="loading"
                    />
                  </div>
                  <span v-if="!isMobilePortrait" class="text-caption mt-n2">
                    Progress
                  </span>
                </div>
              </div>

              <!-- Zoom controls -->
              <div class="zoom-control">
                <div class="d-flex align-center justify-center">
                  <v-btn
                    icon
                    variant="text"
                    @click.stop="zoomOut"
                    :disabled="loading || size <= 50"
                    :size="buttonSize"
                  >
                    <v-icon :size="iconSize">mdi-magnify-minus</v-icon>
                  </v-btn>

                  <div class="text-center zoom-display">
                    <span :class="zoomTextClass">{{ size }}%</span>
                  </div>

                  <v-btn
                    icon
                    variant="text"
                    @click.stop="zoomIn"
                    :disabled="loading || size >= 200"
                    :size="buttonSize"
                  >
                    <v-icon :size="iconSize">mdi-magnify-plus</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </v-card>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { VueReader } from "vue-reader/lib/vue-reader.es.js";
import { useDisplay } from "vuetify";

import { userStore } from "~/stores/UserStore";

const store = userStore();

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
  isEncrypted: {
    type: Boolean,
    default: false,
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
let loadError = ref(null);
const epubReader = ref(null);
const epubData = ref(null); // Will hold the ArrayBuffer directly
const epubOptions = ref({
  width: "100%",
  height: "100%",
  // enabled scrolling for fixed layout
  enableScroll: true,
});
const zoomMenuOpen = ref(false);

let displayToolBar = ref(true);

let isFixedLayout = ref(false);

const closeReader = () => {
  showReader.value = false;
  // exit from fullscreen mode if active
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
  resetIframeStyles(); // Reset styles when closing
};

// Bookmark related state
const bookmarks = ref([]);
const bookmarkNoteDialog = ref(false);
const bookmarkNote = ref("");
const bookmarkNoteError = ref("");
const editingBookmark = ref(null);
const currentExcerpt = ref("");

const current = ref(0);
const percentage = ref(0);

let innerHeight = ref(window.innerHeight);

// every second set the inner height proper value
setInterval(() => {
  // console.log("Updating innerHeight:", window.innerHeight);
  innerHeight.value = window.innerHeight;
  forceUpdateTrigger.value++; // Trigger a reactive update
  // console.log("innerHeight", innerHeight.value);
  forceUpdate();
}, 1000);

const forceUpdateTrigger = ref(0);
const forceUpdate = () => {
  forceUpdateTrigger.value++;
};

// Device and orientation detection
const isMobile = computed(() => {
  forceUpdateTrigger.value; // Make reactive to force updates
  return window.innerWidth < 768;
});

const isTablet = computed(() => {
  forceUpdateTrigger.value;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
});

const isDesktop = computed(() => {
  forceUpdateTrigger.value;
  return window.innerWidth >= 1024;
});

const isPortrait = computed(() => {
  forceUpdateTrigger.value;
  return window.innerHeight > window.innerWidth;
});

const isMobilePortrait = computed(() => {
  return isMobile.value && isPortrait.value;
});

const isMobileLandscape = computed(() => {
  return isMobile.value && !isPortrait.value;
});

// Dynamic sizing based on device and orientation
const toolbarHeight = computed(() => {
  if (isMobilePortrait.value) return 56;
  if (isMobileLandscape.value) return 48;
  return 64;
});

const buttonSize = computed(() => {
  if (isMobilePortrait.value) return "small";
  if (isMobileLandscape.value) return "small";
  return "default";
});

const iconSize = computed(() => {
  if (isMobilePortrait.value) return "small";
  if (isMobileLandscape.value) return "small";
  return "default";
});

const loadingSize = computed(() => {
  if (isMobile.value) return 48;
  return 64;
});

// Layout classes
const controlsLayoutClass = computed(() => {
  if (isMobilePortrait.value) {
    return "d-flex flex-column pa-2";
  }
  return "d-flex justify-space-around align-center pa-2";
});

const zoomTextClass = computed(() => {
  if (isMobilePortrait.value) return "text-caption";
  return "text-body-2";
});

// Dynamic widths
const bookmarkMenuWidth = computed(() => {
  if (isMobile.value) return Math.min(window.innerWidth - 32, 320);
  return 400;
});

const dialogWidth = computed(() => {
  if (isMobile.value) return "90vw";
  return "500px";
});

// Dynamic heights
const readerHeight = computed(() => {
  forceUpdateTrigger.value; // Make reactive to force updates
  const viewportHeight = window.innerHeight;
  const toolbarSpace = displayToolBar.value ? toolbarHeight.value : 0;
  const bottomControlsSpace = displayToolBar.value
    ? isMobilePortrait.value
      ? 80
      : 60
    : 0;
  return `${viewportHeight - toolbarSpace - bottomControlsSpace}px`;
});

// Add this computed to detect when mobile browser bars show/hide
const isBrowserBarVisible = computed(() => {
  forceUpdateTrigger.value; // Make reactive
  const currentHeight = window.innerHeight;
  const baseHeight = screen.height;
  // Detect if browser bar is hidden (viewport expanded)
  return currentHeight < baseHeight * 0.9;
});

// Event handlers
const handleOrientationChange = () => {
  setTimeout(() => {
    forceUpdate();
  }, 200);
};

const handleResize = () => {
  console.log("Window resized:", window.innerWidth, window.innerHeight);
  const newHeight = window.innerHeight;
  if (Math.abs(newHeight - innerHeight.value) > 50) {
    // Threshold to detect significant height changes
    innerHeight.value = newHeight;
    forceUpdate();
  }
};

const handleViewportChange = () => {
  const newHeight = window.innerHeight;
  if (newHeight !== innerHeight.value) {
    innerHeight.value = newHeight;
    forceUpdate();
  }
};

// Encryption constants
const ENCRYPTION_PASSPHRASE =
  "Richness-Gosling-Provided-Charred-Unused-Drapery-Chummy-Crayfish-Dwarf-Handcraft-Implosion-Circle-Refried-Unifier-Whomever-Eclipse-Shorty-State-Rising-Refueling5";

// Function to derive a properly sized encryption key using PBKDF2
const getCryptoKey = async () => {
  // Convert the passphrase to an ArrayBuffer
  const encoder = new TextEncoder();
  const passphraseData = encoder.encode(ENCRYPTION_PASSPHRASE);

  // First, create a key from the passphrase
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    passphraseData,
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  // Use PBKDF2 to derive a 256-bit key suitable for AES-GCM
  // Using a fixed salt for simplicity (in production, this should be unique per user)
  const salt = new TextEncoder().encode(
    "Shrewdly-Patchy-Reword-Diffused-Fanning-External9-Existing-Demystify-Overuse-Disloyal-Bolt-Bodacious-Cupcake-Ascend-Puppet-Suffrage-Doable-Purge-Laundry-Correct"
  );

  // Derive the actual encryption key
  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

const debugArrayBuffer = (buffer, bytesToShow = 20) => {
  const array = new Uint8Array(buffer);
  let hexString = "";
  let asciiString = "";

  for (let i = 0; i < Math.min(bytesToShow, array.length); i++) {
    const byte = array[i];
    // Add hex representation
    hexString += byte.toString(16).padStart(2, "0") + " ";
    // Add ASCII representation if printable, otherwise '.'
    asciiString += byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : ".";
  }

  console.log("Hex: " + hexString);
  console.log("ASCII: " + asciiString);

  // Check for ZIP/EPUB signature
  if (
    array.length >= 4 &&
    array[0] === 0x50 && // P
    array[1] === 0x4b && // K
    array[2] === 0x03 &&
    array[3] === 0x04
  ) {
    console.log("✅ Valid ZIP/EPUB signature detected");
  } else {
    console.log(
      "❌ Invalid ZIP/EPUB signature - this is not a valid EPUB file"
    );
  }
};

// Function to decrypt data
const decryptData = async (encryptedData) => {
  try {
    // Ensure encryptedData is an ArrayBuffer
    const dataBuffer =
      encryptedData instanceof ArrayBuffer
        ? encryptedData
        : await encryptedData.arrayBuffer();

    // Extract the IV (first 12 bytes)
    const iv = new Uint8Array(dataBuffer.slice(0, 12));

    // Extract the encrypted data (everything after the IV)
    const encrypted = new Uint8Array(dataBuffer.slice(12));

    // Get the key
    const key = await getCryptoKey();

    // Decrypt the data
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encrypted
    );

    // Return the decrypted ArrayBuffer directly
    return decryptedData;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt file");
  }
};

// Add event handlers for book lifecycle events
const onBookReady = (bookObj) => {
  console.log("Book is ready:", bookObj);
  book.value = bookObj;
};

const onBookOpen = () => {
  console.log("Book opened successfully");
  // We'll keep loading true until the rendition is created
};

const onBookError = (error) => {
  console.error("Error opening book:", error);
  loadError.value = `Error opening book: ${error.message || "Unknown error"}`;
  loading.value = false;
};

// Load and prepare ebook
const loadEbook = async () => {
  try {
    loading.value = true;
    loadError.value = null;

    console.log("Starting to load ebook from:", props.src);

    // Fetch the ebook file
    const response = await fetch(props.src);

    if (!response.ok) {
      throw new Error(`Failed to fetch ebook: ${response.statusText}`);
    }

    // Get the file as ArrayBuffer
    const fileBuffer = await response.arrayBuffer();

    // Add debug output
    console.log("File size:", fileBuffer.byteLength, "bytes");

    let finalData;

    // Decrypt if needed
    if (props.isEncrypted) {
      console.log("File is encrypted, starting decryption");
      try {
        finalData = await decryptData(fileBuffer);

        // Debug the decrypted data
        console.log("Decrypted data first bytes:");
        debugArrayBuffer(finalData);
      } catch (decryptError) {
        console.error("Decryption error details:", decryptError);
        throw new Error(`Failed to decrypt ebook: ${decryptError.message}`);
      }
    } else {
      console.log("File is not encrypted");
      finalData = fileBuffer;
      // Debug the file data
      console.log("Original file first bytes:");
      debugArrayBuffer(finalData);
    }

    // Set the ArrayBuffer directly as the data source
    // Instead of creating a blob URL
    epubData.value = finalData;

    console.log("EPUB data loaded into memory");
    loading.value = false;

    // Try to load bookmarks after successful ebook loading
    try {
      await loadBookmarks();
    } catch (e) {
      console.error("Error loading bookmarks:", e);
    }
  } catch (error) {
    console.error("Error loading ebook:", error);
    loadError.value = error.message || "Failed to load ebook";
    loading.value = false;
  }
};

// Check if current location is bookmarked
const isCurrentLocationBookmarked = computed(() => {
  if (!location.value) return false;
  return bookmarks.value.some((bookmark) => bookmark.cfi === location.value);
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
    await store.saveBookMarks(props.bookId, bookmarks.value);
  } catch (e) {
    console.error("Error saving bookmarks:", e);
  }
};

const openReader = async () => {
  showReader.value = true;
  await loadEbook();
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
const toggleBookmark = async () => {
  if (!location.value) return;

  if (isCurrentLocationBookmarked.value) {
    await removeBookmark(location.value);
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
  await addBookmark(location.value, bookmarkNote.value, currentExcerpt.value);

  // Reset and close dialog
  bookmarkNote.value = "";
  bookmarkNoteError.value = "";
  bookmarkNoteDialog.value = false;
};

const addBookmark = async (cfi, note = "", excerpt = "") => {
  const chapterTitle = getCurrentChapterTitle();

  bookmarks.value.push({
    cfi,
    chapterTitle,
    note,
    excerpt,
    date: new Date().toISOString(),
  });

  await saveBookmarks();
};

const removeBookmark = async (cfi) => {
  bookmarks.value = bookmarks.value.filter((bookmark) => bookmark.cfi !== cfi);
  await saveBookmarks();
};

const clearAllBookmarks = async () => {
  bookmarks.value = [];
  await saveBookmarks();
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

// Get rendition from vue-reader
const getRendition = (rend) => {
  console.log("Rendition created successfully");
  rendition.value = rend;
  loading.value = false;

  // Apply font size and themes
  if (rendition.value) {
    rendition.value.themes.fontSize(`${size.value}%`);

    // Add CSS to prevent text selection
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

    rendition.value.themes.select("default");

    // Disable text selection and context menu
    rendition.value.on("selected", (cfiRange, contents) => {
      contents.window.getSelection().removeAllRanges();
    });

    rendition.value.hooks.content.register((contents) => {
      contents.window.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        return false;
      });

      contents.window.addEventListener("dragstart", (e) => {
        e.preventDefault();
        return false;
      });

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

  // Enhanced progress tracking for both reflowable and fixed layout
  if (rend.book) {
    book.value = rend.book;

    // Load navigation
    rend.book.loaded.navigation
      .then((nav) => {
        toc.value = nav.toc;
      })
      .catch((err) => {
        console.error("Failed to load navigation:", err);
      });

    // Enhanced progress tracking
    book.value.ready
      .then(() => {
        // Check if it's a fixed layout EPUB
        return book.value.loaded.metadata.then((metadata) => {
          const isFixedLayout = metadata.layout === "pre-paginated";
          console.log(
            "EPUB Layout:",
            isFixedLayout ? "Fixed Layout" : "Reflowable"
          );

          if (isFixedLayout) {
            // For fixed layout EPUBs, use spine-based progress
            setupFixedLayoutProgress();
          } else {
            // For reflowable EPUBs, use location-based progress
            return book.value.locations.generate(1600).then(() => {
              setupReflowableProgress();
            });
          }
        });
      })
      .catch((err) => {
        console.error("Failed to setup progress tracking:", err);
        // Fallback to spine-based progress
        setupFixedLayoutProgress();
      });

    book.value.loaded.metadata.then((metadata) => {
      isFixedLayout.value = metadata.layout === "pre-paginated";
      console.log(
        "EPUB Layout:",
        isFixedLayout.value ? "Fixed Layout" : "Reflowable"
      );

      // Apply initial zoom based on layout type
      applyZoomWithCSS(size.value);
    });
  }

  enableScrollOnIframe();
};

const enableScrollOnIframe = () => {
  console.log("Enabling scrolling on iframes for fixed layout");
};

const resetIframeStyles = () => {
  console.log("Resetting iframe styles and modifications");

  // Remove any custom zoom styles
  cleanupZoomStyles();

  // Remove any spacer elements created for scrolling
  const spacer = document.getElementById("epub-zoom-spacer");
  if (spacer) {
    spacer.remove();
  }

  // Reset size to default
  size.value = 100;

  // Reset any iframe modifications
  const iframes = document.querySelectorAll(".epub-reader-wrapper iframe");
  iframes.forEach((iframe) => {
    try {
      if (iframe.contentDocument && iframe.contentWindow) {
        const iframeDoc = iframe.contentDocument;
        const iframeHtml = iframeDoc.documentElement;
        const iframeBody = iframeDoc.body;

        // Reset styles
        if (iframeHtml) {
          iframeHtml.style.overflow = "";
          iframeHtml.style.height = "";
        }

        if (iframeBody) {
          iframeBody.style.overflow = "";
          iframeBody.style.width = "";
          iframeBody.style.height = "";
          iframeBody.style.minHeight = "";
          iframeBody.style.minWidth = "";
        }
      }
    } catch (e) {
      console.error("Error resetting iframe content:", e);
    }
  });

  // Reset wrapper element styles
  const wrapperElement = document.querySelector(".epub-reader-wrapper");
  if (wrapperElement) {
    wrapperElement.style.overflow = "";
    wrapperElement.style.overflowX = "";
    wrapperElement.style.overflowY = "";
    wrapperElement.style.minWidth = "";
    wrapperElement.style.minHeight = "";
    wrapperElement.style.position = "";
  }
};

// Update your watch function for showReader
watch(showReader, (isVisible) => {
  if (isVisible) {
    document.addEventListener("keydown", handleKeyboardShortcuts);
    document.addEventListener("dragstart", preventDragStart);
    document.addEventListener("wheel", handleWheelZoom, { passive: false });
  } else {
    document.removeEventListener("keydown", handleKeyboardShortcuts);
    document.removeEventListener("dragstart", preventDragStart);
    document.removeEventListener("wheel", handleWheelZoom);

    // Reset iframe styles when closing
    resetIframeStyles();

    // Existing cleanup
    cleanupResources();
  }
});

// Progress tracking for fixed layout EPUBs
const setupFixedLayoutProgress = () => {
  console.log("Setting up fixed layout progress tracking");

  // Get initial progress based on spine position
  const updateProgress = () => {
    if (rendition.value && rendition.value.location) {
      const currentLocation = rendition.value.location.start;
      if (currentLocation && book.value && book.value.spine) {
        // Find current spine item index
        const spineItem = book.value.spine.get(currentLocation.href);
        if (spineItem) {
          const currentIndex = book.value.spine.spineItems.findIndex(
            (item) => item.href === spineItem.href
          );
          const totalItems = book.value.spine.spineItems.length;

          if (currentIndex !== -1 && totalItems > 0) {
            // Calculate progress as percentage through the spine
            const progress = Math.round(
              ((currentIndex + 1) / totalItems) * 100
            );
            current.value = Math.min(Math.max(progress, 0), 100);
            console.log(
              `Fixed layout progress: ${current.value}% (${
                currentIndex + 1
              }/${totalItems})`
            );
          }
        }
      }
    }
  };

  // Update progress on location changes
  rendition.value.on("relocated", (location) => {
    console.log("Location changed:", location);
    // update iframe scrolling
    enableScrollOnIframe();
    updateProgress();
  });

  // Initial progress update
  setTimeout(updateProgress, 100);
};

// Progress tracking for reflowable EPUBs
const setupReflowableProgress = () => {
  console.log("Setting up reflowable progress tracking");

  const updateProgress = () => {
    if (rendition.value && rendition.value.currentLocation()) {
      const currentLocation = rendition.value.currentLocation();
      if (currentLocation && currentLocation.start && book.value.locations) {
        const percent = book.value.locations.percentageFromCfi(
          currentLocation.start.cfi
        );
        current.value = Math.round(percent * 100);
        console.log(`Reflowable progress: ${current.value}%`);
      }
    }
  };

  // Update progress on location changes
  rendition.value.on("relocated", (location) => {
    updateProgress();
  });

  // Initial progress update
  setTimeout(updateProgress, 100);
};

// 3. Add this new function for progress slider change:
const changeProgress = (e) => {
  const value = parseInt(e.target.value);
  current.value = value;

  if (!book.value || !rendition.value) return;

  // Check if we have location data (reflowable) or need to use spine (fixed layout)
  book.value.loaded.metadata
    .then((metadata) => {
      const isFixedLayout = metadata.layout === "pre-paginated";

      if (isFixedLayout || !book.value.locations) {
        // For fixed layout, navigate by spine position
        const totalItems = book.value.spine.spineItems.length;
        const targetIndex = Math.round((value / 100) * (totalItems - 1));
        const targetItem = book.value.spine.spineItems[targetIndex];

        if (targetItem && targetItem.href) {
          console.log(
            `Navigating to spine item ${targetIndex + 1}/${totalItems}: ${
              targetItem.href
            }`
          );
          rendition.value.display(targetItem.href);
        }
      } else {
        // For reflowable, use CFI-based navigation
        const cfi = book.value.locations.cfiFromPercentage(value / 100);
        if (cfi) {
          rendition.value.display(cfi);
        }
      }
    })
    .catch((err) => {
      console.error("Error in progress change:", err);
      // Fallback to spine-based navigation
      const totalItems = book.value.spine.spineItems.length;
      const targetIndex = Math.round((value / 100) * (totalItems - 1));
      const targetItem = book.value.spine.spineItems[targetIndex];

      if (targetItem && targetItem.href) {
        rendition.value.display(targetItem.href);
      }
    });
};
// Add this method to your script setup section
const resetZoom = () => {
  size.value = 100;
  applyZoomWithCSS(100);
};

const zoomIn = () => {
  if (size.value < 200) {
    size.value += 10;
    applyZoomWithCSS(size.value);
  }
};

const zoomOut = () => {
  if (size.value > 50) {
    size.value -= 10;
    applyZoomWithCSS(size.value);
  }
};
const changeSize = (val) => {
  size.value = val;
  applyZoomWithCSS(val);
};

// The most reliable approach - container scaling
// Improved zoom solution that doesn't affect the toolbar
const applyZoomWithCSS = (zoomValue) => {
  if (!rendition.value) return;

  const scaleValue = zoomValue / 100;

  if (isFixedLayout.value) {
    // Create or update zoom stylesheet
    let zoomStyle = document.getElementById("epub-zoom-style");
    if (!zoomStyle) {
      zoomStyle = document.createElement("style");
      zoomStyle.id = "epub-zoom-style";
      document.head.appendChild(zoomStyle);
    }

    // CSS that targets only the EPUB iframe content with proper scrollbar handling
    zoomStyle.textContent = `
      .reader {
        transform: scale(${scaleValue}) !important;
        transform-origin: top center !important;        
        height: 100% !important;
        width: 100% !important;
        margin-right: auto !important;
        inset: 0 !important;
      }

    `;

    // // Apply to existing content if available
    // if (rendition.value.getContents) {
    //   rendition.value.getContents().forEach((contents) => {
    //     const document = contents.document;
    //     const body = document.body;
    //     const html = document.documentElement;

    //     if (body && html) {
    //       html.style.overflow = "auto";
    //       html.style.overflowX = "auto";
    //       html.style.overflowY = "auto";
    //       html.style.width = "100%";
    //       html.style.height = "100%";

    //       body.style.overflow = "visible";
    //       body.style.width = "100%";
    //       body.style.height = "auto";
    //       body.style.minHeight = "100%";
    //     }
    //   });
    // }
    enableScrollOnIframe();

    console.log(`Applied CSS-based zoom with scrollbars: ${zoomValue}%`);
  } else {
    // Reflowable content
    if (rendition.value.themes) {
      rendition.value.themes.fontSize(`${zoomValue}%`);
    }
  }
};

const setupIframeObserver = () => {
  if (typeof MutationObserver !== "undefined") {
    const observer = new MutationObserver((mutations) => {
      let shouldEnableScroll = false;

      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          // Check if any iframe was added
          mutation.addedNodes.forEach((node) => {
            if (
              node.tagName === "IFRAME" ||
              (node.querySelectorAll &&
                node.querySelectorAll("iframe").length > 0)
            ) {
              shouldEnableScroll = true;
            }
          });
        }
      });

      if (shouldEnableScroll) {
        enableScrollOnIframe();
      }
    });

    // Start observing the reader wrapper
    setTimeout(() => {
      const wrapper = document.querySelector(".reader");
      if (wrapper) {
        observer.observe(wrapper, {
          childList: true,
          subtree: true,
        });
        console.log("Iframe observer started");
      }
    }, 500);

    // Store observer reference for cleanup
    return observer;
  }
  return null;
};

const cleanupZoomStyles = () => {
  const zoomStyle = document.getElementById("epub-zoom-style");
  if (zoomStyle) {
    zoomStyle.remove();
  }
};

const handleKeyboardShortcuts = (e) => {
  if (showReader.value && (e.ctrlKey || e.metaKey)) {
    switch (e.key) {
      case "=":
      case "+":
        e.preventDefault();
        zoomIn();
        break;
      case "-":
        e.preventDefault();
        zoomOut();
        break;
      case "0":
        e.preventDefault();
        size.value = 100;
        changeSize(100);
        break;
      case "s":
      case "p":
      case "c":
        e.preventDefault();
        return false;
    }
  }
};

const fullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
};

watch(showReader, (isVisible) => {
  if (isVisible) {
    document.addEventListener("keydown", handleKeyboardShortcuts);
    document.addEventListener("dragstart", preventDragStart);
  } else {
    document.removeEventListener("keydown", handleKeyboardShortcuts);
    document.removeEventListener("dragstart", preventDragStart);
    cleanupResources();
  }
});

onUnmounted(() => {
  // Clean up event listeners when the component is unmounted
  document.removeEventListener("contextmenu", preventContextMenu);
  document.removeEventListener("keydown", handleKeyboardShortcuts);
  document.removeEventListener("dragstart", preventDragStart);
  cleanupResources();
  cleanupZoomStyles();
});

// 6. Optional: Add mouse wheel zoom functionality
const handleWheelZoom = (e) => {
  if (showReader.value && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  }
};

// Add wheel event listener in the watch function
watch(showReader, (isVisible) => {
  if (isVisible) {
    document.addEventListener("keydown", handleKeyboardShortcuts);
    document.addEventListener("dragstart", preventDragStart);
    document.addEventListener("wheel", handleWheelZoom, { passive: false });
  } else {
    document.removeEventListener("keydown", handleKeyboardShortcuts);
    document.removeEventListener("dragstart", preventDragStart);
    document.removeEventListener("wheel", handleWheelZoom);
    cleanupResources();
  }
});

// Update onUnmounted as well
onUnmounted(() => {
  document.removeEventListener("contextmenu", preventContextMenu);
  document.removeEventListener("keydown", handleKeyboardShortcuts);
  document.removeEventListener("dragstart", preventDragStart);
  document.removeEventListener("wheel", handleWheelZoom);
  cleanupResources();
});

const getLabel = (toc, href) => {
  let label = "n/a";
  toc.some((item) => {
    if (item.subitems && item.subitems.length > 0) {
      const subChapter = getLabel(item.subitems, href);
      if (subChapter !== "n/a") {
        label = subChapter;
        return true;
      }
    } else if (item.href && href && item.href.includes(href)) {
      label = item.label;
      return true;
    }
  });
  return label;
};

const locationChange = (epubcifi) => {
  // enable ifram scroll
  enableScrollOnIframe();

  location.value = epubcifi;

  if (epubcifi && rendition.value && rendition.value.location) {
    try {
      const { displayed, href } = rendition.value.location.start;
      if (displayed && href) {
        const label = getLabel(toc.value, href);
        pageInfo.value = `${displayed.page}/${displayed.total} ${label}`;
      }
    } catch (e) {
      console.error("Error updating location:", e);
    }
  }
  // Re-enable iframe scrolling after location change
  enableScrollOnIframe();
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

// Clean up resources when dialog is closed or component unmounted
const cleanupResources = () => {
  // Clear the ArrayBuffer data reference
  epubData.value = null;

  // Reset rendition and book references
  rendition.value = null;
  book.value = null;

  // Reset any other state that should be cleared
  loadError.value = null;
  toc.value = [];
  pageInfo.value = "";
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
    cleanupResources();
  }
});

onMounted(() => {
  // Add the event listener for the entire document when the component is mounted
  document.addEventListener("contextmenu", preventContextMenu);

  // Setup observer for iframe changes
  const observer = setupIframeObserver();

  window.addEventListener("orientationchange", handleOrientationChange);
  window.addEventListener("resize", handleResize);
  // Add viewport change detection
  window.addEventListener("scroll", handleViewportChange, { passive: true });
  window.visualViewport?.addEventListener("resize", handleViewportChange);

  // Clean up observer in onUnmounted
  onUnmounted(() => {
    // Existing unmounted code...

    if (observer) {
      observer.disconnect();
    }
  });
});

onUnmounted(() => {
  // Clean up event listeners when the component is unmounted
  document.removeEventListener("contextmenu", preventContextMenu);
  document.removeEventListener("keydown", preventSave);
  document.removeEventListener("dragstart", preventDragStart);
  cleanupResources();

  window.removeEventListener("orientationchange", handleOrientationChange);
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("scroll", handleViewportChange);
  window.visualViewport?.removeEventListener("resize", handleViewportChange);
});
</script>

<style>
.readerArea {
  overflow: scroll !important;
}

.epub-reader-wrapper {
  border: 1px solid #ccc;
  background-color: green !important;
}

.epub-container {
  background-color: #fff !important;
}

.reader-main-card {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.reader-toolbar {
  flex-shrink: 0;
}

.bottom-controls {
  flex-shrink: 0;
}

.loading-container {
  padding: 3rem 0;
}

/* Responsive progress control */
.progress-control {
  flex: 1 1 auto;
  min-width: 0;
  padding: 0 1rem;
}

.progress-slider {
  flex: 1;
  margin: 0 0.5rem;
  min-width: 100px;
}

.zoom-control {
  flex: 0 0 auto;
  padding: 0 1rem;
}

.zoom-display {
  min-width: 50px;
  margin: 0 0.5rem;
  text-align: center;
}

/* Mobile portrait specific styles */
@media screen and (max-width: 767px) and (orientation: portrait) {
  .progress-control {
    margin-bottom: 0.5rem;
    padding: 0;
  }

  .zoom-control {
    padding: 0;
  }

  .progress-slider {
    min-width: 80px;
  }

  .zoom-display {
    min-width: 40px;
    font-size: 0.875rem;
  }
}

/* Mobile landscape specific styles */
@media screen and (max-width: 767px) and (orientation: landscape) {
  .reader-toolbar {
    padding: 0 0.5rem;
  }

  .bottom-controls {
    padding: 0.25rem 0;
  }

  .progress-slider {
    min-width: 60px;
  }
}

/* Tablet styles */
@media screen and (min-width: 768px) and (max-width: 1023px) {
  .progress-slider {
    min-width: 150px;
  }

  .zoom-display {
    min-width: 60px;
  }
}

/* Desktop styles */
@media screen and (min-width: 1024px) {
  .progress-slider {
    min-width: 200px;
  }

  .zoom-display {
    min-width: 70px;
  }

  .progress-control,
  .zoom-control {
    padding: 0 2rem;
  }
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

/* Responsive bookmarks menu */
@media screen and (max-width: 767px) {
  .bookmarks-menu {
    max-height: 50vh;
  }
}

.zoom-menu {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Toolbar toggle button responsive positioning */
.toolbar-toggle-btn {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Ensure proper touch targets on mobile */
@media screen and (max-width: 767px) {
  .v-btn {
    min-width: 44px;
    min-height: 44px;
  }
}

/* Smooth transitions for orientation changes */
.reader-main-card,
.epub-reader-wrapper {
  transition: height 0.3s ease-in-out;
}

/* Fix for iOS Safari viewport height issues */
@supports (-webkit-touch-callout: none) {
  .reader-main-card {
    height: 100vh;
    height: -webkit-fill-available;
  }
}
</style>
