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
        <section-title title="JOURNAL OF ORIENTAL RESEARCH" />
        <div class="sectionSubtitle2">
          KSRI has been publishing the Journal of Oriental Research periodically
          from its inception till date and it is internationally well-known. The
          journal is listed under the UGC CARE list of Journals - Arts &
          Humanities No. 367 with ISSN: 0022 - 3301.
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
        <v-text-field
          class="ma-4"
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          label="Search by journal title"
          placeholder="Search by journal title"
          single-line
          variant="outlined"
          hide-details
        ></v-text-field>
        <!-- book catalogue -->
        <div class="ma-4">
          <v-row>
            <v-col
              v-for="book in filteJournalsBasedOnPublication('KSRI')"
              :key="book.title"
              cols="12"
              md="4"
              data-aos="fade-up"
            >
              <book-card
                :is-book="false"
                :book="book"
                @viewDetails="onViewDetails"
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
const description =
  "KSRI has been publishing the Journal of Oriental Research periodically from its inception till date and it is internationally well known.";

useSeoMeta({
  title: "Journals",
  description: description,
  ogTitle: "Journals",
  ogDescription: description,
  twitterTitle: "Journals",
  twitterDescription: description,
});

let isLoading = ref(true);

const searchQuery = ref("");

const selectedBook = reactive({});
const showSelectedBookDetails = ref(false);

// get all additionalpublications
const additionalPublicationsData = await queryContent(
  "publications",
  "additionalpublications"
).findOne();
const additionalPublications = additionalPublicationsData.body;
console.log("additionalPublications", additionalPublications);

let additionalPublicationJournals = {};

const booksData = await queryContent("publications", "journals").findOne();

const ksriBooks = booksData.body;

additionalPublicationJournals["KSRI"] = ksriBooks;

// Add computed property for filtered books
const filteredBooks = computed(() => {
  const query = searchQuery.value.toLowerCase();

  if (!query) return journals.value;

  return journals.value.filter(
    (journal) =>
      journal.title?.toLowerCase().includes(query) ||
      journal.author?.toLowerCase().includes(query) ||
      journal.subtitle?.toLowerCase().includes(query)
  );
});

const journals = computed((publicationName) => {
  return additionalPublicationJournals[publicationName];
});

const filteJournalsBasedOnPublication = (publicationName) => {
  let journals = additionalPublicationJournals[publicationName];
  const query = searchQuery.value.toLowerCase();

  if (!query) return journals;

  const removeDiacritics = (str) =>
    str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const normalizedQuery = removeDiacritics(query);

  return journals.filter(
    (journal) =>
      removeDiacritics(journal.title)
        ?.toLowerCase()
        .includes(normalizedQuery) ||
      removeDiacritics(journal.author)
        ?.toLowerCase()
        .includes(normalizedQuery) ||
      removeDiacritics(journal.subtitle)
        ?.toLowerCase()
        .includes(normalizedQuery)
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
  navigateTo("/academic-and-research-pursuits/ksri-publications/journals");
};

// scroll to top on selectedbook details
watch(showSelectedBookDetails, (newValue) => {
  if (newValue) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

isLoading.value = false;
</script>
