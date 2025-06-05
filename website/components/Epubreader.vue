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
      <v-toolbar dark color="primary" style="height: 7vh !important">
        <div class="d-flex align-center w-100">
          <v-spacer />

          <!-- Bookmark current location button -->
          <v-tooltip
            location="bottom"
            text="Bookmark this page"
            v-if="displayBookMark"
          >
            <template v-slot:activator="{ props: tooltipProps }">
              <div class="d-flex flex-column justify-center align-center mx-4">
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
                <span class="text-subtitle-2 mt-n2"> Bookmark</span>
              </div>
            </template>
          </v-tooltip>

          <!-- Bookmarks list button -->
          <v-menu v-if="displayBookMark" class="mx-8">
            <template v-slot:activator="{ props: menuProps }">
              <div class="d-flex flex-column justify-center align-center">
                <v-btn icon v-bind="menuProps" class="mr-2" :disabled="loading">
                  <v-icon>mdi-bookmark-multiple</v-icon>
                </v-btn>

                <span class="text-subtitle-2 mt-n2"> View Bookmarks</span>
              </div>
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

      <v-card class="pa-0" elevation="4" color="primary">
        <v-card-text @contextmenu.prevent class="pa-0 ma-0">
          <v-row>
            <!-- Error Alert -->
            <v-col v-if="loadError" cols="12">
              <v-alert type="error" closable>
                {{ loadError }}
              </v-alert>
            </v-col>

            <!-- Loading Indicator -->
            <v-col v-if="loading" cols="12" class="text-center py-12">
              <v-progress-circular
                indeterminate
                color="primary"
                size="64"
              ></v-progress-circular>
              <div class="mt-4">Loading ebook...</div>
            </v-col>

            <!-- Viewer -->
            <v-col v-else class="ma-0 pa-0">
              <div
                class="epub-reader-wrapper no-select"
                style="height: 86vh; position: relative; overflow: auto"
                @contextmenu.prevent
              >
                <v-no-ssr>
                  <vue-reader
                    class="ma-0"
                    v-if="epubData"
                    :url="epubData"
                    :location.sync="location"
                    :getRendition="getRendition"
                    @update:location="locationChange"
                    ref="epubReader"
                  />
                </v-no-ssr>
              </div>
              <!-- <div class="d-flex justify-space-between mt-2">
                <div>{{ pageInfo }}</div>
              </div> -->
            </v-col>
          </v-row>
          <v-toolbar
            dark
            color="primary"
            style="height: 7vh !important"
            class="pa-2"
          >
            <div class="d-flex align-center w-100">
              <v-spacer />

              <!-- Progress Control -->
              <div class="d-flex flex-column justify-center align-center mx-4">
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
                    style="width: 150px; margin-right: 8px"
                    :disabled="loading"
                  />
                </div>
                <span class="text-caption mt-n2">Progress</span>
              </div>
              <v-spacer />

              <!-- Zoom Controls Menu -->
              <v-menu
                class="mx-4"
                :close-on-content-click="false"
                persistent
                v-model="zoomMenuOpen"
              >
                <template v-slot:activator="{ props }">
                  <div class="d-flex flex-column justify-center align-center">
                    <v-btn
                      icon
                      v-bind="props"
                      :disabled="loading"
                      variant="text"
                    >
                      <v-icon>mdi-magnify-plus</v-icon>
                    </v-btn>
                    <span class="mt-n2">zoom </span>
                  </div>
                </template>
                <v-card min-width="200" class="zoom-menu">
                  <v-card-text class="pa-3">
                    <div class="d-flex align-center justify-space-between">
                      <v-btn
                        size="small"
                        variant="outlined"
                        @click.stop="resetZoom"
                        :disabled="loading || size === 100"
                        density="compact"
                      >
                        Reset
                      </v-btn>

                      <v-btn
                        icon
                        size="small"
                        @click="zoomMenuOpen = false"
                        variant="text"
                      >
                        <v-icon size="small">mdi-close</v-icon>
                      </v-btn>
                    </div>
                    <div class="d-flex align-center justify-center">
                      <v-btn
                        icon
                        variant="text"
                        @click.stop="zoomOut"
                        :disabled="loading || size <= 50"
                        class="mr-2"
                      >
                        <v-icon size="small">mdi-magnify-minus</v-icon>
                      </v-btn>

                      <div
                        class="zoom-display mx-3 text-center"
                        style="min-width: 60px"
                      >
                        <span class="text-body-2">{{ size }}%</span>
                      </div>

                      <v-btn
                        icon
                        variant="text"
                        @click.stop="zoomIn"
                        :disabled="loading || size >= 200"
                        class="ml-2"
                      >
                        <v-icon size="small">mdi-magnify-plus</v-icon>
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-menu>
              <v-spacer />
            </div>
          </v-toolbar>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { VueReader } from "vue-reader/lib/vue-reader.es.js";

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
const epubOptions = ref({});
const zoomMenuOpen = ref(false);

let isFixedLayout = ref(false);

// Bookmark related state
const bookmarks = ref([]);
const bookmarkNoteDialog = ref(false);
const bookmarkNote = ref("");
const bookmarkNoteError = ref("");
const editingBookmark = ref(null);
const currentExcerpt = ref("");

const current = ref(0);
const percentage = ref(0);

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
};

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
      .epub-reader-wrapper {
        overflow: auto !important;
      }
      
      .epub-reader-wrapper iframe {
        transform: scale(${scaleValue}) !important;
        transform-origin: top left !important;
        width: ${100 / scaleValue}% !important;
        height: ${100 / scaleValue}% !important;
      }
      
      /* Ensure the iframe document has proper scrolling */
      .epub-reader-wrapper iframe html,
      .epub-reader-wrapper iframe body {
        overflow: auto !important;
        width: 100% !important;
        height: 100% !important;
      }
    `;

    // Also apply scrolling properties directly to the wrapper
    const wrapperElement = document.querySelector(".epub-reader-wrapper");
    if (wrapperElement) {
      wrapperElement.style.overflow = "auto";
      wrapperElement.style.overflowX = "auto";
      wrapperElement.style.overflowY = "auto";
    }

    // Apply content hooks to ensure iframe content has proper scrolling
    if (rendition.value.hooks && rendition.value.hooks.content) {
      rendition.value.hooks.content.register((contents) => {
        const document = contents.document;
        const body = document.body;
        const html = document.documentElement;

        if (body && html) {
          // Ensure proper scrolling for the iframe content
          html.style.overflow = "auto";
          html.style.overflowX = "auto";
          html.style.overflowY = "auto";
          html.style.width = "100%";
          html.style.height = "100%";

          body.style.overflow = "visible";
          body.style.width = "100%";
          body.style.height = "auto";
          body.style.minHeight = "100%";
        }
      });
    }

    // Apply to existing content if available
    if (rendition.value.getContents) {
      rendition.value.getContents().forEach((contents) => {
        const document = contents.document;
        const body = document.body;
        const html = document.documentElement;

        if (body && html) {
          html.style.overflow = "auto";
          html.style.overflowX = "auto";
          html.style.overflowY = "auto";
          html.style.width = "100%";
          html.style.height = "100%";

          body.style.overflow = "visible";
          body.style.width = "100%";
          body.style.height = "auto";
          body.style.minHeight = "100%";
        }
      });
    }

    console.log(`Applied CSS-based zoom with scrollbars: ${zoomValue}%`);
  } else {
    // Reflowable content
    if (rendition.value.themes) {
      rendition.value.themes.fontSize(`${zoomValue}%`);
    }
  }
};

const cleanupZoomStyles = () => {
  const zoomStyle = document.getElementById("epub-zoom-style");
  if (zoomStyle) {
    zoomStyle.remove();
  }
};

const applyZoomWithHooks = (zoomValue) => {
  if (!rendition.value) return;

  const scaleValue = zoomValue / 100;

  if (isFixedLayout.value) {
    // For fixed layout, use content hooks to apply scaling
    rendition.value.hooks.content.register((contents) => {
      const document = contents.document;
      const body = document.body;
      const html = document.documentElement;

      if (body && html) {
        // Reset previous transforms
        body.style.transform = "";
        html.style.overflow = "";
        body.style.overflow = "";

        // Apply scaling
        body.style.transform = `scale(${scaleValue})`;
        body.style.transformOrigin = "top left";

        // Ensure scrolling works
        html.style.overflow = "auto";
        body.style.overflow = "visible";

        // Calculate scaled dimensions
        const originalWidth = body.scrollWidth;
        const originalHeight = body.scrollHeight;

        // Set minimum dimensions to ensure content isn't cut off
        body.style.minWidth = `${originalWidth}px`;
        body.style.minHeight = `${originalHeight}px`;

        // Adjust the viewport meta tag if it exists
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute(
            "content",
            `width=device-width, initial-scale=${scaleValue}, user-scalable=yes`
          );
        }
      }
    });

    // Apply to existing content
    if (rendition.value.getContents) {
      rendition.value.getContents().forEach((contents) => {
        const document = contents.document;
        const body = document.body;
        const html = document.documentElement;

        if (body && html) {
          body.style.transform = `scale(${scaleValue})`;
          body.style.transformOrigin = "top left";
          html.style.overflow = "auto";
          body.style.overflow = "visible";
          body.style.minWidth = `${body.scrollWidth}px`;
          body.style.minHeight = `${body.scrollHeight}px`;
        }
      });
    }
  } else {
    // Reflowable content
    if (rendition.value.themes) {
      rendition.value.themes.fontSize(`${zoomValue}%`);
    }
  }
};

const applyZoomAlternative = (zoomValue) => {
  if (!rendition.value || !isFixedLayout.value) {
    // For reflowable, use the standard fontSize approach
    if (rendition.value && rendition.value.themes) {
      rendition.value.themes.fontSize(`${zoomValue}%`);
    }
    return;
  }

  const scaleValue = zoomValue / 100;

  // CSS to inject into the EPUB content
  const zoomCSS = `
    body {
      transform: scale(${scaleValue}) !important;
      transform-origin: top left !important;
      width: ${100 / scaleValue}% !important;
      height: ${100 / scaleValue}% !important;
    }
    
    html {
      width: ${100 / scaleValue}% !important;
      height: ${100 / scaleValue}% !important;
      overflow: hidden !important;
    }
  `;

  // Register the zoom theme
  rendition.value.themes.register("zoom", {
    body: {
      transform: `scale(${scaleValue}) !important`,
      "transform-origin": "top left !important",
      width: `${100 / scaleValue}% !important`,
      height: `${100 / scaleValue}% !important`,
    },
    html: {
      width: `${100 / scaleValue}% !important`,
      height: `${100 / scaleValue}% !important`,
      overflow: "hidden !important",
    },
  });

  // Apply the zoom theme
  rendition.value.themes.select("zoom");

  console.log(
    `Applied fixed layout zoom: ${zoomValue}% (scale: ${scaleValue})`
  );
};

const applyZoom = (zoomValue) => {
  if (!rendition.value) return;

  try {
    if (isFixedLayout.value) {
      // For fixed layout EPUBs, use CSS transform to scale the entire content
      const scaleValue = zoomValue / 100;

      // Apply transform to the iframe content
      rendition.value.hooks.content.register((contents) => {
        const bodyElement = contents.document.body;
        if (bodyElement) {
          bodyElement.style.transform = `scale(${scaleValue})`;
          bodyElement.style.transformOrigin = "top left";

          // Adjust the container size to prevent scrollbars
          const container = contents.document.documentElement;
          if (container) {
            container.style.width = `${100 / scaleValue}%`;
            container.style.height = `${100 / scaleValue}%`;
          }
        }
      });

      // If content is already loaded, apply the transform immediately
      if (rendition.value.getContents) {
        rendition.value.getContents().forEach((content) => {
          const bodyElement = content.document.body;
          if (bodyElement) {
            bodyElement.style.transform = `scale(${scaleValue})`;
            bodyElement.style.transformOrigin = "top left";

            const container = content.document.documentElement;
            if (container) {
              container.style.width = `${100 / scaleValue}%`;
              container.style.height = `${100 / scaleValue}%`;
            }
          }
        });
      }

      console.log(
        `Applied fixed layout zoom: ${zoomValue}% (scale: ${scaleValue})`
      );
    } else {
      // For reflowable EPUBs, use fontSize
      if (rendition.value.themes) {
        rendition.value.themes.fontSize(`${zoomValue}%`);
        console.log(`Applied reflowable zoom: ${zoomValue}%`);
      }
    }
  } catch (error) {
    console.error("Error applying zoom:", error);
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
});

onUnmounted(() => {
  // Clean up event listeners when the component is unmounted
  document.removeEventListener("contextmenu", preventContextMenu);
  document.removeEventListener("keydown", preventSave);
  document.removeEventListener("dragstart", preventDragStart);
  cleanupResources();
});
</script>

<style scoped>
.epub-reader-wrapper {
  border: 1px solid #ccc;
  height: 500px;
  overflow: auto !important; /* Changed from hidden to auto */
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

/* Add this to the existing <style scoped> section */

.zoom-menu {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.zoom-display {
  font-weight: 500;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 4px 8px;
  background-color: #f5f5f5;
}
</style>
