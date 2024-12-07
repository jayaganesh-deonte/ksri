<template>
  <div class="ma-6">
    <div>
      <section-title title="KSRI Publications" />
      <div class="sectionSubtitle2">
        KSRI has been publishing the Journal of Oriental Research periodically
        from its inception till date and it is internationally well known.
      </div>
    </div>
    <!-- book catalogue -->
    <div class="ma-4" v-if="!showSelectedBookDetails">
      <v-row>
        <v-col
          v-for="(book, index) in storeBook.books"
          :key="book.title"
          cols="12"
          md="4"
          data-aos="fade-up"
          :data-aos-delay="100 * index"
        >
          <book-card :book="book" @viewDetails="onViewDetails" />
        </v-col>
      </v-row>
    </div>
    <!-- book details -->
    <div v-else>
      <div class="text-center my-8">
        <v-btn
          rounded="pill"
          variant="outlined"
          color="primary"
          @click="navigateToBookCatalogue"
        >
          List of Book Catalogue
        </v-btn>

        <!-- show book details -->
        <div class="ma-4">
          <v-row>
            <v-col cols="12" md="5">
              <v-carousel
                hide-delimiters
                hide-delimiter-background
                show-arrows-on-hover
              >
                <v-carousel-item
                  v-for="imageUrl in selectedBook.imageUrls"
                  :key="imageUrl"
                >
                  <v-img :src="imageUrl" fit></v-img>
                </v-carousel-item>
              </v-carousel>
            </v-col>
            <v-col
              cols="12"
              md="7"
              class="d-flex flex-column justify-space-around"
            >
              <div>
                <div class="text-h5 text-secondary">
                  {{ selectedBook.name }}
                </div>
                <div class="text-h6">{{ selectedBook.subtitle }}</div>
                <div class="text-h6 text-secondary">
                  Price: {{ selectedBook.price }}
                </div>
              </div>
              <div class="text-start my-6">
                <div class="sectionSubtitle2">Details:</div>
                <div class="text-body-1">
                  {{ selectedBook.details }}
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const description =
  "KSRI has been publishing the Journal of Oriental Research periodically from its inception till date and it is internationally well known.";

useSeoMeta({
  title: "Books",
  description: description,
  ogTitle: "Books",
  ogDescription: description,
  twitterTitle: "Books",
  twitterDescription: description,
});

import { bookStore } from "~/stores/bookStore";

const storeBook = await bookStore();

const selectedBook = reactive({});
const showSelectedBookDetails = ref(false);

const resetSelectedBook = () => {
  showSelectedBookDetails.value = false;

  selectedBook.name = "";
  selectedBook.subtitle = "";
  selectedBook.price = "";
  selectedBook.imageUrls = [];
  selectedBook.details = "";
};

resetSelectedBook();

const onViewDetails = (book) => {
  selectedBook.name = book.name;
  selectedBook.subtitle = book.subtitle;
  selectedBook.price = book.price;
  selectedBook.imageUrls = book.imageUrls;
  selectedBook.details = book.details;

  showSelectedBookDetails.value = true;
};

const navigateToBookCatalogue = () => {
  resetSelectedBook();
  navigateTo("/academic-and-research-pursuits/ksri-publications/books");
};
// scroll to top on selectedbook details
watch(showSelectedBookDetails, (newValue) => {
  if (newValue) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});
</script>
