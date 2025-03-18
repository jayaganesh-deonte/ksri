<template>
  <div>
    <div v-if="isLoading">
      <v-progress-circular
        class="text-center"
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
    </div>
    <div class="ma-6" v-if="!isLoading">
      <div>
        <section-title title="BOOKS/MONOGRAPHS" />
        <div class="sectionSubtitle2">
          Books and Monographs are being published periodically as an endeavour
          to promote Sanskrit and Indological Studies. They cover a wide range
          of subjects which include Vedic Studies, Yoga, Literature, Language,
          Grammar, Philosophy, Religion, Mathematics, Astronomy, Astrology,
          Medical Science, Ayurveda, Arthasastra, Purva Mimamsa, Advaita, Nyaya,
          Vaishnavism, Saivism, Arts, Science, etc. Around 100 Books and
          Monographs including critical editions of hitherto unpublished
          manuscripts on different aspects of Sanskrit and Indology have also
          been published so far.
        </div>
      </div>

      <!-- selectedPublicationToDisplay -->
      <!-- <div class="text-center ma-4">
        <v-btn
          rounded="pill"
          class="ma-4"
          v-for="publication in publicationNames"
          :key="publication"
          :color="
            publication === selectedPublicationToDisplay
              ? 'primary'
              : 'secondary'
          "
          @click="selectedPublicationToDisplay = publication"
          :variant="
            publication === selectedPublicationToDisplay ? 'flat' : 'outlined'
          "
        >
          {{ publication }}
        </v-btn>
      </div> -->
      <!-- add search based on book name (title), author name(author) -->

      <div v-if="!showSelectedBookDetails">
        <v-row>
          <v-col cols="12" md="4" data-aos="fade-up"> </v-col>
          <v-col cols="12" md="4" data-aos="fade-up">
            <v-text-field
              class="ma-4"
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              label="Search by book title or author"
              placeholder="Search by book title or author"
              single-line
              variant="outlined"
              hide-details
              bg-color="white"
              color="white"
              rounded="pill"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4" data-aos="fade-up"> </v-col>
        </v-row>
        <div class="d-flex justify-center align-center">
          <div></div>
        </div>

        <!-- book catalogue -->
        <div class="ma-4">
          <v-row>
            <v-col
              v-for="book in filterBooksBasedOnPublication('KSRI')"
              :key="book.title"
              cols="12"
              md="4"
              data-aos="fade-up"
            >
              <book-card :book="book" @viewDetails="onViewDetails" />
            </v-col>
          </v-row>
        </div>
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
            Back to Catalogue
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

let isLoading = ref(true);

const searchQuery = ref("");

const selectedBook = reactive({});
const showSelectedBookDetails = ref(false);

const booksData = await queryContent("publications", "books").findOne();

const ksriBooks = booksData.body;

const filterBooksBasedOnPublication = (publicationName) => {
  // sort allBooks based on year of publication

  let books = ksriBooks;

  books.sort((a, b) => {
    const yearA = a.yearOfPublication.trim();
    const yearB = b.yearOfPublication.trim();
    if (yearA && yearB) {
      return yearA < yearB ? 1 : -1;
    } else if (yearA) {
      return -1;
    } else if (yearB) {
      return 1;
    } else {
      return 0;
    }
  });

  const query = searchQuery.value.toLowerCase();

  if (!query) return books;

  const removeDiacritics = (str) => {
    return str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  return books.filter(
    (book) =>
      removeDiacritics(book.title)
        ?.toLowerCase()
        .includes(removeDiacritics(query)) ||
      removeDiacritics(book.author)
        ?.toLowerCase()
        .includes(removeDiacritics(query)) ||
      removeDiacritics(book.subtitle)
        ?.toLowerCase()
        .includes(removeDiacritics(query))
  );
};

const resetSelectedBook = () => {
  showSelectedBookDetails.value = false;

  selectedBook.name = "";
  selectedBook.subtitle = "";
  selectedBook.price = "";
  selectedBook.imageUrls = [];
  selectedBook.details = "";
};

// resetSelectedBook();

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
  navigateTo("/ksri-publications/books");
};

// scroll to top on selectedbook details
watch(showSelectedBookDetails, (newValue) => {
  if (newValue) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

isLoading.value = false;
</script>
