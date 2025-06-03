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
          Initiated by professor S. Kuppuswami Sastri in 1927, the 'Journal of
          Oriental Research' is a reputed internationally acclaimed magazine
          covering various aspects involved in Sanskrit and Indological studies.
          The publication of this magazine was entrusted to the Institute from
          1944. More than 95 volumes of the journal have been published so far.
          The Journal, reputed for original research and scientific
          investigation, carries general, critical and research articles on
          diverse indological subjects. Some rare texts, critically edited and
          appear serially as supplementary to the original volumes later get
          published as independent books.
        </div>
        <br />
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
        <v-row>
          <v-col cols="12" md="4" data-aos="fade-up"> </v-col>
          <v-col cols="12" md="4" data-aos="fade-up">
            <v-text-field
              class="ma-4"
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              label="Search by journal title"
              placeholder="Search by journal title"
              single-line
              variant="outlined"
              hide-details
              bg-white="white"
              rounded="pill"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4" data-aos="fade-up"> </v-col>
        </v-row>

        <!-- book catalogue -->
        <div v-if="filteJournalsBasedOnPublication('KSRI').length === 0">
          <div class="text-center ma-4">
            <v-icon size="64" color="primary">mdi-book-remove</v-icon>
            <div class="text-h6">No results found</div>
          </div>
        </div>
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

const journals = computed((publicationName) => {
  return additionalPublicationJournals[publicationName];
});

const filteJournalsBasedOnPublication = (publicationName) => {
  let journals = additionalPublicationJournals[publicationName];

  // Sort journals by availability first (Yes comes before No)
  journals.sort((a, b) => {
    // First sort by availability (Yes comes before No)
    if (a.available !== b.available) {
      return a.available === "Yes" ? -1 : 1;
    }

    // Then sort by year of publication (most recent first)
    const yearA = a.yearOfPublication?.toString().trim();
    const yearB = b.yearOfPublication?.toString().trim();
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

  if (!query) return journals;

  const removeDiacritics = (str) => {
    return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
  };

  const normalizedQuery = removeDiacritics(query);

  return journals.filter(
    (journal) =>
      journal.title.toLowerCase().includes(normalizedQuery) ||
      journal.subtitle?.toString().toLowerCase()?.includes(normalizedQuery) ||
      journal.details?.toString().toLowerCase()?.includes(normalizedQuery) ||
      journal.keywords?.toString().toLowerCase()?.includes(normalizedQuery) ||
      journal.yearOfPublication
        ?.toString()
        .toLowerCase()
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
  navigateTo("/ksri-publications/journals");
};

// scroll to top on selectedbook details
watch(showSelectedBookDetails, (newValue) => {
  if (newValue) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

isLoading.value = false;
</script>
