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
        <section-title :title="selectedAdditionalPublication" />
      </div>

      <!-- add search based on book name (title), author name(author) -->

      <div v-if="!showSelectedBookDetails">
        <v-text-field
          class="ma-4"
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          label="Search by book title or author"
          placeholder="Search by book title or author"
          single-line
          variant="outlined"
          hide-details
        ></v-text-field>
        <!-- book catalogue -->
        <div class="ma-4">
          <v-row>
            <v-col
              v-for="book in filterBooksBasedOnPublication(
                selectedAdditionalPublication
              )"
              :key="book.title"
              cols="12"
              md="4"
              data-aos="fade-up"
            >
              <book-card
                :book="book"
                @viewDetails="onViewDetails"
                :isAdditionalPublicationData="true"
              />
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
// get id from url
const route = useRoute();
const id = route.params.id;

const selectedAdditionalPublication = ref(id);

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

// get all additionalpublications
const additionalPublicationsData = await queryContent(
  "publications",
  "additionalpublications"
).findOne();
const additionalPublications = additionalPublicationsData.body;

// for additionalPublications query content
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

  additionalPublicationBooks[additionalPublication] = [
    ...additionalPublicationJournalsData.body,
    ...additionalPublicationBooksData.body,
  ];

  // sort additionalPublications by yearOfPublication

  additionalPublicationBooks[additionalPublication].sort((a, b) => {
    // Handle empty or missing yearOfPublication
    if (!a.yearOfPublication) return 1;
    if (!b.yearOfPublication) return -1;

    // Compare dates using Date object comparison
    const dateA = new Date(a.yearOfPublication);
    const dateB = new Date(b.yearOfPublication);

    // Compare timestamps to sort from newest to oldest
    return dateB.getTime() - dateA.getTime();
  });
}

const ksriBooks = booksData.body;

additionalPublicationBooks["KSRI"] = ksriBooks;

const books = computed((publicationName) => {
  return additionalPublicationBooks[publicationName];
});

const filterBooksBasedOnPublication = (publicationName) => {
  let books = additionalPublicationBooks[publicationName];

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
  navigateTo("/academic-and-research-pursuits/ksri-publications/");
};

// scroll to top on selectedbook details
watch(showSelectedBookDetails, (newValue) => {
  if (newValue) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

isLoading.value = false;
</script>
