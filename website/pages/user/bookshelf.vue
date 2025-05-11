<template>
  <v-container v-if="getIsAuthenticated">
    <v-row>
      <v-col>
        <h1 class="text-h4 mb-6">Book Shelf</h1>
      </v-col>
      <v-col>
        <v-text-field
          v-model="search"
          label="Search Books"
          append-inner-icon="mdi-magnify"
          clearable
          class="mb-4"
          variant="outlined"
          density="compact"
          bg-color="white"
          rounded="pill"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Loading state -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="mt-4">Loading your books...</p>
      </v-col>
    </v-row>

    <!-- Error state -->
    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert type="error" prominent>
          {{ error }}
          <template v-slot:append>
            <v-btn color="error" variant="text" @click="fetchBooks"
              >Try Again</v-btn
            >
          </template>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Empty state -->
    <v-row v-else-if="books.length === 0">
      <v-col cols="12">
        <v-card class="pa-6 text-center">
          <v-icon icon="mdi-book-off" size="64" class="mb-4"></v-icon>
          <h2 class="text-h5 mb-2">No Books Found</h2>
          <p>You haven't purchased any books yet.</p>
          <v-btn color="primary" class="mt-4" to="/ksri-publications"
            >Browse Store</v-btn
          >
        </v-card>
      </v-col>
    </v-row>

    <!-- Books display -->
    <v-row v-else>
      <v-col
        v-for="(book, index) in filteredBooks"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card height="100%" class="d-flex flex-column">
          <v-img
            :src="book.bookDetails.imageUrls || '/img/ksri-logo.png'"
            height="200"
            fit
          ></v-img>

          <div class="text-h6 ma-2">{{ book.bookName }}</div>

          <div>
            <p class="text-caption text-grey ma-2">
              Purchased on {{ formatDate(book.paymentDate) }}
            </p>
            <p class="text-caption text-grey ma-2">
              Author: {{ book.bookDetails.author }}
            </p>
          </div>

          <div class="ma-2 mt-auto">
            <!-- <v-btn
              variant="tonal"
              color="primary"
              block
              @click="readBook(book)"
            >
              Read Book
              <v-icon icon="mdi-book-open-page-variant" class="ml-2"></v-icon>
            </v-btn> -->

            <bookReader :book-info="book" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({
  middleware: ["authenticated"],
});

import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { userStore } from "~/stores/UserStore";
import { format } from "date-fns";
import axios from "axios";

const store = userStore();
const { getIsAuthenticated } = storeToRefs(store);

const books = ref([]);
const loading = ref(true);
const error = ref(null);

let search = ref("");

const filteredBooks = computed(() => {
  if (!search.value) return books.value;
  const searchTerm = search.value.toLowerCase();
  return books.value.filter(
    (book) =>
      book.bookName.toLowerCase().includes(searchTerm) ||
      (book.bookDetails &&
        book.bookDetails.author.toLowerCase().includes(searchTerm)) ||
      (book.bookDetails &&
        book.bookDetails.keywords.toLowerCase().includes(searchTerm)) ||
      (book.bookDetails.details &&
        book.bookDetails.details.toLowerCase().includes(searchTerm))
  );
});

// Format date for display
const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch (e) {
    return dateString;
  }
};

const booksData = await queryContent("publications", "books").findOne();

const allBooks = booksData.body;

console.log("Books data:", allBooks);

// Fetch books from API
const fetchBooks = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Get user email from store or local storage
    const userEmail = store.userEmail || localStorage.getItem("userEmail");

    if (!userEmail) {
      throw new Error("User email not found");
    }

    const runtimeConfig = useRuntimeConfig();

    const idToken = await store.getToken();

    const response = await axios.get(
      `${runtimeConfig.public.PURCHASE_API_URL}/ebook/${encodeURIComponent(
        userEmail
      )}`,
      {
        headers: {
          Authorization: idToken,
        },
      }
    );

    if (!response.status === 200) {
      throw new Error(
        `Failed to fetch books: ${response.status} ${response.statusText}`
      );
    }

    const data = response.data;
    books.value = data;

    // fetch the book object from allBooks Array using bookId and id from allbooks and then merge the books object with the data
    books.value = books.value.map((book) => {
      const bookDetails = allBooks.find((b) => b.id === book.bookId);
      return {
        ...book,
        // ...bookDetails,
        id: bookDetails.id,
        title: bookDetails.title,
        ebookPrice: bookDetails.ebookPrice,

        bookDetails: {
          ...bookDetails,
        },
      };
    });

    console.log("Fetched books:", books.value);
  } catch (err) {
    console.error("Error fetching books:", err);
    error.value =
      err.message || "Failed to load your books. Please try again later.";
  } finally {
    loading.value = false;
  }
};

// Handle reading a book
const readBook = (book) => {
  console.log("Read book clicked:", book);
};

// Fetch books when component is mounted
onMounted(() => {
  if (getIsAuthenticated.value) {
    fetchBooks();
  }
});
</script>

<style scoped>
/* Add any custom styles here */
</style>
