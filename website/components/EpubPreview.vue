<template>
  <div>
    <!-- Preview Book Button -->
    <v-btn
      color="primary"
      @click="openReader"
      :loading="loading"
      rounded="pill"
    >
      Preview Book
    </v-btn>

    <!-- Full Screen Reader Dialog -->
    <v-dialog
      v-model="showReader"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <!-- TOC Toggle Button -->
          <v-btn icon @click="toggleToc" aria-label="Toggle Table of Contents">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
          <v-toolbar-title>{{ bookTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>

          <!-- Font Size Controls -->
          <!-- <v-btn icon @click="decreaseFontSize" aria-label="Decrease Font Size">
            <v-icon>mdi-format-font-size-decrease</v-icon>
          </v-btn>
          <span class="font-size-display">{{ fontSize }}px</span>
          <v-btn icon @click="increaseFontSize" aria-label="Increase Font Size">
            <v-icon>mdi-format-font-size-increase</v-icon>
          </v-btn> -->

          <v-btn icon @click="togglePageView" aria-label="Toggle Page View">
            <v-icon>{{ isDoublePage ? "mdi-book-open" : "mdi-book" }}</v-icon>
          </v-btn>
          <v-btn icon @click="closeReader" aria-label="Close Reader">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-row class="fill-height">
          <!-- TOC Section -->
          <div
            v-show="showToc"
            class="toc-container"
            aria-label="Table of Contents"
          >
            <h3 class="toc-title">Table of Contents</h3>
            <v-divider></v-divider>
            <v-list dense>
              <template v-for="(item, index) in toc" :key="index">
                <v-list-item
                  @click="navigateToChapter(item.href)"
                  :class="{ 'primary--text': currentChapter === item.href }"
                  role="button"
                  tabindex="0"
                  aria-label="Navigate to {{ item.label }}"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ item.label }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
            <!-- Progress Display -->
            <div class="progress-container">
              <v-progress-linear
                :model-value="readingProgress"
                color="primary"
                height="6"
                aria-label="Reading Progress"
              ></v-progress-linear>
              <p class="progress-text">
                {{ readingProgress.toFixed(2) }}% Completed
              </p>
            </div>
          </div>

          <!-- Main Reader Container -->
          <v-col
            :cols="showToc ? 9 : 12"
            class="d-flex flex-column align-center justify-center"
          >
            <div
              class="reader-container"
              ref="readerContainer"
              aria-label="EPUB Reader"
            >
              <div
                v-if="loading"
                class="d-flex justify-center align-center h-100"
              >
                <v-progress-circular
                  indeterminate
                  color="primary"
                  aria-label="Loading"
                ></v-progress-circular>
              </div>
              <div v-show="!loading" id="epub-viewer" class="book-view"></div>
            </div>

            <!-- Reader Controls -->
            <v-card-actions class="reader-controls">
              <v-btn icon @click="prevPage" aria-label="Previous Page">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <span class="text-body-2" aria-live="polite">
                {{ currentPage }} / {{ totalPages }}
              </span>
              <v-spacer></v-spacer>
              <v-btn icon @click="nextPage" aria-label="Next Page">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { Book } from "epubjs";
// Include the CSS module for advanced styling options
// import "epubjs/dist/css/epub.css";

export default {
  name: "EpubReader",
  props: {
    buttonText: {
      type: String,
      default: "Preview Book",
    },
    epubUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showReader: false,
      showToc: true, // Display TOC by default
      loading: false,
      book: null,
      rendition: null,
      bookTitle: "Loading...",
      toc: [],
      currentChapter: "",
      currentPage: 0,
      totalPages: 0,
      isDoublePage: false, // Toggle for single/double page view
      readingProgress: 0, // Reading progress percentage
      fontSize: 16, // Default font size in pixels
      theme: "light", // Default theme
    };
  },
  methods: {
    openReader() {
      this.showReader = true;
      this.loading = true;
      this.initReader();
    },
    closeReader() {
      this.showReader = false;
      if (this.book) {
        this.book.destroy();
        this.book = null;
      }
      if (this.rendition) {
        this.rendition.destroy();
        this.rendition = null;
      }
    },
    toggleToc() {
      this.showToc = !this.showToc;
    },
    togglePageView() {
      this.isDoublePage = !this.isDoublePage;
      if (this.rendition) {
        this.rendition.spread(this.isDoublePage ? "auto" : "none");
      }
    },
    async initReader() {
      try {
        // Create a new book
        this.book = new Book(this.epubUrl, {
          openAs: "epub",
        });

        // Get metadata and table of contents
        await this.book.ready;
        const metadata = await this.book.loaded.metadata;
        this.bookTitle = metadata.title || "eBook";

        // Get TOC
        const navigation = await this.book.loaded.navigation;
        this.toc = navigation.toc.map((item) => ({
          label: item.label,
          href: item.href,
        }));

        // Initialize the rendition
        this.$nextTick(() => {
          const viewerElement = document.getElementById("epub-viewer");
          this.rendition = this.book.renderTo(viewerElement, {
            width: "100%",
            height: "100%",
            spread: this.isDoublePage ? "auto" : "none",
          });

          // Load user preferences
          this.loadUserPreferences();

          // Set initial font size
          this.rendition.themes.fontSize(`${this.fontSize}px`);

          // Load the last read page or the first page
          const lastLocation = this.getLastReadLocation();
          if (lastLocation) {
            this.rendition.display(lastLocation).then(() => {
              this.updateProgress(); // Ensure progress bar and page number are updated
            });
          } else {
            this.rendition.display();
          }

          // Set up event listeners
          this.setupEventListeners();

          // Generate locations for accurate page numbers
          this.book.locations.generate(1600).then(() => {
            this.totalPages = this.book.locations.total;
            this.updateProgress();
          });

          this.loading = false;
        });
      } catch (error) {
        console.error("Error loading ebook:", error);
        this.bookTitle = "Error loading book";
        this.loading = false;
      }
    },
    setupEventListeners() {
      // Track page changes
      this.rendition.on("relocated", (location) => {
        if (this.book.locations.total) {
          this.currentPage = this.book.locations.locationFromCfi(
            location.start.cfi
          );
          this.updateProgress();
        }
        // Track current chapter
        this.currentChapter = location.start.href;

        // Save the last read location
        this.saveLastReadLocation(location.start.cfi);
      });
    },
    prevPage() {
      if (this.rendition) {
        this.rendition.prev();
      }
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next();
      }
    },
    navigateToChapter(href) {
      if (this.rendition) {
        this.rendition.display(href);
        this.showToc = false;
      }
    },
    saveLastReadLocation(cfi) {
      const storageKey = `lastReadLocation-${this.epubUrl}`;
      localStorage.setItem(storageKey, cfi);
    },
    getLastReadLocation() {
      const storageKey = `lastReadLocation-${this.epubUrl}`;
      return localStorage.getItem(storageKey);
    },
    updateProgress() {
      if (this.totalPages > 0) {
        this.readingProgress = (this.currentPage / this.totalPages) * 100;
      }
    },
    // Font size control methods
    increaseFontSize() {
      if (this.fontSize < 32) {
        // Set a maximum font size
        this.fontSize += 2;
        this.applyFontSize();
        this.saveUserPreferences();
      }
    },
    decreaseFontSize() {
      if (this.fontSize > 8) {
        // Set a minimum font size
        this.fontSize -= 2;
        this.applyFontSize();
        this.saveUserPreferences();
      }
    },
    applyFontSize() {
      if (this.rendition) {
        // Apply the font size to the EPUB content
        this.rendition.themes.fontSize(`${this.fontSize}px`);
      }
    },
    // Save and load user preferences
    saveUserPreferences() {
      const preferences = {
        fontSize: this.fontSize,
        isDoublePage: this.isDoublePage,
      };
      const storageKey = `userPreferences-${this.epubUrl}`;
      localStorage.setItem(storageKey, JSON.stringify(preferences));
    },
    loadUserPreferences() {
      const storageKey = `userPreferences-${this.epubUrl}`;
      const savedPreferences = localStorage.getItem(storageKey);

      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        this.fontSize = preferences.fontSize || 16;
        this.isDoublePage = preferences.isDoublePage || false;
      }
    },
    applyTheme() {
      // Remove theme functionality
    },
    setTheme(theme) {
      // Remove theme functionality
    },
  },
};
</script>
<style scoped>
.reader-container {
  position: relative;
  width: 100%;
  height: 90vh;
  max-width: 800px;
  aspect-ratio: 3 / 4;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Standard syntax */
}

.toc-container {
  width: 300px;
  background-color: #f5f5f5;
  padding: 16px;
  overflow-y: auto;
  border-right: 1px solid #ddd;
}

.toc-title {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

#epub-viewer {
  width: 100%;
  height: 100%;
  background-color: #fff;

  /* Disable text selection and copying */
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
}

.reader-controls {
  border-top: 1px solid #e0e0e0;
  padding: 8px 16px;
}

.progress-container {
  margin-top: 16px;
  text-align: center;
}

.progress-text {
  margin-top: 8px;
  font-size: 14px;
  color: #555;
}

.font-size-display {
  display: inline-block;
  min-width: 40px;
  text-align: center;
  font-size: 14px;
  margin: 0 4px;
}
</style>
