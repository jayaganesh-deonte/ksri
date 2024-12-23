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
        <section-title title="KSRI Publications" />
        <div class="sectionSubtitle2">
          KSRI has been publishing the Journal of Oriental Research periodically
          from its inception till date and it is internationally well known.
        </div>
      </div>

      <!-- selectedPublicationToDisplay -->
      <div class="text-center ma-4">
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
      </div>
      <!-- add search based on book name (title), author name(author) -->

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
      <div class="ma-4" v-if="!showSelectedBookDetails">
        <v-row>
          <v-col
            v-for="(book, index) in filteredBooks"
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

// publications
const publicationNames = ["KSRI", "Samskrita Academy"];

let selectedPublicationToDisplay = ref(publicationNames[0]);

let isLoading = ref(true);

const searchQuery = ref("");

const selectedBook = reactive({});
const showSelectedBookDetails = ref(false);

const samskritaAcademyPublicationsData = await queryContent(
  "publications",
  "samskritaacademypublications"
).findOne();

const samskritaAcademyPublications = samskritaAcademyPublicationsData.body;
const booksData = await queryContent("publications", "books").findOne();

const ksriBooks = booksData.body;

//  Sample Book Item
// {
//     "title": "SAMSKṚTA SĀHITYA ITIHĀSAḤ (A History of Sanskrit Literature);",
//     "subtitle": "Prof. R. S. Venkatarama Sastri | Golden Jubilee Publication | The Kuppuswami Sastri Research Institute, Mylapore, Chennai - 600 004 | 1996 | pp. 264 +  viii",
//     "price": "₹ 100",
//     "imageUrls": [
//       "https://d30y75l38k1y9.cloudfront.net/upload/samskta-shitya-itihsa.jpg"
//     ],
//     "details": "“The book opens with the history of Vedic literature in which the time of Vedas, Vedic metres, Vedic rivers, trees, animals, Upaniṣad, etc. have been discussed and it is clear that we get much light and guidance in going through the entire Vedic literature. “The next part of the book is devoted to the history of  Kāvya (literary form of art), in which the details about time of poets and the contents of their creations have been highlighted. It includes Kālidāsa, Vararuci, Aśvaghoṣa, Bhāravi, Bhaṭṭi, Māgha Kṣemendra, Hemachandra, et. al. and their poetic creations. A separate section is devoted to the discussion of the historical aspect of Sanskrit drama and dramatists.  “It is a very difficult work to give a brief account of the whole Sanskrit literature in English by various Western scholars is available. But such a history in Sanskit is very rare.”\nDr. Raghunath Ghosh, Prabuddha Bharata.",
//     "id": "01JFPQE6VJCJ7H811XBT7B3939",
//     "publication": "KSRI",
//     "available": "Yes",
//     "copies": "10",
//     "metadata": {
//       "updated_by": "demo",
//       "created_at": "2024-12-22T08:23:46.290Z",
//       "updated_at": "2024-12-23T14:59:23.266Z",
//       "created_by": "admin"
//     },
//     "author": "Prof. R. S. Venkatarama Sastri",
//     "yearOfPublication": "1996"
//   },
let books = computed(() => {
  // if publication is KSRI => storeBook.books
  // if publication is Samskrita Academy => storeBook.samskritaAcademyPublicationBooks

  if (selectedPublicationToDisplay.value === "KSRI") {
    return ksriBooks;
  } else {
    return samskritaAcademyPublications;
  }
});

// Add computed property for filtered books
const filteredBooks = computed(() => {
  const query = searchQuery.value.toLowerCase();

  if (!query) return books.value;

  return books.value.filter(
    (book) =>
      book.title?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query) ||
      book.subtitle?.toLowerCase().includes(query)
  );
});

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
  navigateTo("/academic-and-research-pursuits/ksri-publications/books");
};

// scroll to top on selectedbook details
watch(showSelectedBookDetails, (newValue) => {
  if (newValue) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

isLoading.value = false;
</script>
