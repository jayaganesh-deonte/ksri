<template>
  <div>
    <div v-if="!bookInfoFetched" class="d-flex justify-center ma-6">
      <!-- show loader -->
      <v-progress-circular
        size="100"
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>
    <div v-else>
      <!-- display book details -->
      <!-- two cols, 1st col with image as carousel, 2nd col with book details, title, subtitle, price and then details -->
      <div v-if="bookNotFound" class="d-flex justify-center ma-6">
        <!-- 404 component -->
        <div class="d-flex flex-column justify-center align-center">
          <div class="text-h1 text-secondary">404</div>
          <div class="text-h4 text-secondary">Book Not Found</div>
          <div class="text-body-1 text-secondary">
            The book you are looking for does not exist.
          </div>
          <div class="d-flex justify-center ma-4">
            <v-btn
              rounded="pill"
              variant="outlined"
              color="primary"
              to="/academic-and-research-pursuits/ksri-publications/books/"
            >
              Back to Book Catalogue
            </v-btn>
          </div>
        </div>
      </div>
      <div class="ma-4" v-else>
        <div class="d-flex justify-center ma-4">
          <v-btn
            rounded="pill"
            variant="outlined"
            color="primary"
            to="/academic-and-research-pursuits/ksri-publications/books/"
          >
            List of Book Catalogue
          </v-btn>
        </div>
        <v-row>
          <v-col cols="12" md="6" data-aos="fade-right">
            <v-carousel
              hide-delimiters
              hide-delimiter-background
              show-arrows-on-hover
            >
              <template v-if="bookInfo.imageUrls">
                <v-carousel-item
                  v-for="imageUrl in bookInfo.imageUrls"
                  :key="imageUrl"
                >
                  <v-img :src="imageUrl" fit></v-img>
                </v-carousel-item>
              </template>
              <template v-else>
                <v-carousel-item>
                  <v-img src="/img/ksri-logo.png" fit></v-img>
                </v-carousel-item>
              </template>
            </v-carousel>
          </v-col>
          <v-col
            cols="12"
            md="6"
            class="d-flex flex-column justify-space-around"
          >
            <div>
              <div
                class="text-h5 text-secondary"
                data-aos="fade-left"
                data-aos-delay="100"
              >
                {{ bookInfo.title }}
              </div>
              <div class="text-h6" data-aos="fade-left" data-aos-delay="200">
                {{ bookInfo.subtitle }}
              </div>
              <div
                class="text-h6 text-secondary"
                data-aos="fade-left"
                data-aos-delay="300"
              >
                Price: {{ bookInfo.price }}
              </div>
              <div
                class="text-start pa-0 mt-5 text-danger"
                v-if="bookInfo.available != 'Yes'"
                data-aos-delay="400"
              >
                <v-chip color="error" label outlined rounded="pill">
                  Out of Stock
                </v-chip>
              </div>
            </div>
            <div class="text-body-1" data-aos="fade-left" data-aos-delay="400">
              {{ bookInfo.details }}
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script setup>
const samskritaAcademyPublicationsData = await queryContent(
  "publications",
  "samskritaacademypublications"
).findOne();

const samskritaAcademyPublications = samskritaAcademyPublicationsData.body;
const booksData = await queryContent("publications", "books").findOne();

const ksriBooks = booksData.body;

let books = reactive([...ksriBooks, ...samskritaAcademyPublications]);

onMounted(async () => {
  getBookInfo();
});

// get book id from route
const route = useRoute();

const bookInfoFetched = ref(false);

const bookNotFound = ref(false);

const bookInfo = reactive({
  title: "",
  subtitle: "",
  price: "",
  imageUrls: "",
  details: "",
  id: "",
  available: "",
  publication: "",
});
const getBookById = (id) => {
  // find book from book & samskritaAcademyPublicationBooks list if not found return null
  const book = books.find((book) => book.id === id);
  if (book) {
    return book;
  }
  return null;
};
// get books
const getBookInfo = async () => {
  const book = getBookById(route.params.id);

  if (book == null) {
    bookNotFound.value = true;
  } else {
    bookInfo.title = book.title;
    bookInfo.subtitle = book.subtitle;
    bookInfo.price = book.price;
    bookInfo.imageUrls = book.imageUrls;
    bookInfo.details = book.details;
    bookInfo.id = book.id;
    bookInfo.available = book.available;
    bookInfo.publication = book.publication;
  }
  bookInfoFetched.value = true;

  useSeoMeta({
    title: book.title,
    description: book.subtitle,
    ogTitle: book.title,
    ogDescription: book.subtitle,
    twitterTitle: book.title,
    twitterDescription: book.subtitle,
  });
};
</script>
