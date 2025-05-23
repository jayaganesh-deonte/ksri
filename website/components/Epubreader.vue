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

                <span class="text-subtitle-2 mt-n2"> View All Bookmarks</span>
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

      <v-card class="pa-0" elevation="4">
        <v-card-text @contextmenu.prevent>
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
            <v-col v-else>
              <div
                class="epub-reader-wrapper no-select"
                style="height: 100vh; position: relative"
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
                  />
                </v-no-ssr>
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

// Bookmark related state
const bookmarks = ref([]);
const bookmarkNoteDialog = ref(false);
const bookmarkNote = ref("");
const bookmarkNoteError = ref("");
const editingBookmark = ref(null);
const currentExcerpt = ref("");

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

  // Set loading to false once we have a rendition
  loading.value = false;

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

  // Get the book object and load navigation
  if (rend.book) {
    book.value = rend.book;
    rend.book.loaded.navigation
      .then((nav) => {
        toc.value = nav.toc;
      })
      .catch((err) => {
        console.error("Failed to load navigation:", err);
      });
  }
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
