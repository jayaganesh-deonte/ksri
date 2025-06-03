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
        <section-title title="EBooks" />
        <div class="sectionSubtitle2">
          As a premier Institution in the field of research, KSRI has involved
          itself actively in the pursuit of excellence in its field of
          specialisation. In order to remain competitive and abreast of the
          requirement of Scholars, the books available in eBook format
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
              v-for="book in filterBooksBasedOnPublication()"
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

let additionalPublicationBooks = {};

const booksData = await queryContent("publications", "books").findOne();

let ksriBooks = booksData.body;

// get all additionalpublications
const additionalPublicationsData = await queryContent(
  "publications",
  "additionalpublications"
).findOne();
const additionalPublications = additionalPublicationsData.body;

for (const element of additionalPublications) {
  const additionalPublication = element;

  const publicationNameForFile =
    additionalPublication.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() +
    "journals";

  // query content
  const additionalPublicationJournalsData = await queryContent(
    "publications",
    publicationNameForFile
  ).findOne();

  // books
  const publicationNameForBooks = additionalPublication
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

  // query content
  const additionalPublicationBooksData = await queryContent(
    "publications",
    publicationNameForBooks
  ).findOne();

  // additionalPublicationBooks[additionalPublication] = [
  //   ...additionalPublicationJournalsData.body,
  //   ...additionalPublicationBooksData.body,
  // ];

  // append additional publication books data to ksribooks
  ksriBooks = [...ksriBooks, ...additionalPublicationBooksData.body];
}

// filter ksriBooks where "isEbookAvailable": "Yes"
ksriBooks = ksriBooks.filter((book) => book.isEbookAvailable === "Yes");

const filterBooksBasedOnPublication = (publicationName) => {
  // sort allBooks based on availability first, then year of publication
  let books = ksriBooks;

  books.sort((a, b) => {
    // First sort by availability (Yes comes before No)
    if (a.available !== b.available) {
      return a.available === "Yes" ? -1 : 1;
    }

    // Then sort by year of publication (most recent first)
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
        .includes(removeDiacritics(query)) ||
      removeDiacritics(book.keywords)
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
  navigateTo("/ebooks/books");
};

// scroll to top on selectedbook details
watch(showSelectedBookDetails, (newValue) => {
  if (newValue) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

isLoading.value = false;
</script>
