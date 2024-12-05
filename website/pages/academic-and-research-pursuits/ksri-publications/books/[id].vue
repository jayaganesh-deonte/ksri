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
      <div class="ma-4">
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
          <v-col cols="12" md="6">
            <v-carousel
              hide-delimiters
              hide-delimiter-background
              show-arrows-on-hover
            >
              <v-carousel-item
                v-for="imageUrl in bookInfo.imageUrls"
                :key="imageUrl"
              >
                <v-img :src="imageUrl" fit></v-img>
              </v-carousel-item>
            </v-carousel>
          </v-col>
          <v-col
            cols="12"
            md="6"
            class="d-flex flex-column justify-space-around"
          >
            <div>
              <div class="text-h5 text-secondary">{{ bookInfo.title }}</div>
              <div class="text-h6">{{ bookInfo.subtitle }}</div>
              <div class="text-h6 text-secondary">Rs. {{ bookInfo.price }}</div>
            </div>
            <div class="text-body-1">{{ bookInfo.details }}</div>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { bookStore } from "~/stores/bookStore";

const storeBook = bookStore();

// get book id from route
const route = useRoute();

console.log(route.params.id);

const bookInfoFetched = ref(false);

const bookInfo = reactive({
  title: "",
  subtitle: "",
  price: "",
  imageUrls: "",
  details: "",
  id: "",
});

// get books
const getBookInfo = async () => {
  const book = await storeBook.getBookById(route.params.id);

  bookInfo.title = book.title;
  bookInfo.subtitle = book.subtitle;
  bookInfo.price = book.price;
  bookInfo.imageUrls = book.imageUrls;
  bookInfo.details = book.details;
  bookInfo.id = book.id;
  bookInfoFetched.value = true;
};

onMounted(() => {
  getBookInfo();
});
</script>
