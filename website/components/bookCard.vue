<template>
  <v-card
    class="ma-1"
    height="100%"
    rounded="0"
    :elevation="isHovering ? 5 : 2"
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <v-card
      class="pa-2 ma-2 d-flex flex-column justify-space-between"
      height="100%"
      elevation="0"
      rounded="0"
    >
      <!-- First Row  -->
      <div class="d-flex align-center justify-end">
        <!-- chip with print status -->

        <v-card
          v-if="book.printStatus && book.printStatus == 'Upcoming'"
          color="#5d53e8"
          outlined
          rounded="pill"
          class="text-center font-weight-bold pa-2 text-body-1"
        >
          {{ book.printStatus }}
        </v-card>
      </div>
      <v-row>
        <!-- Title and Details Column -->
        <v-col cols="12" sm="12" class="py-2">
          <!-- image -->
          <div data-aos="fade-up" v-if="book.imageUrls">
            <v-img
              :src="getImageUrl(book.imageUrls[0])"
              fit
              height="200"
            ></v-img>
          </div>
          <!-- else display logo -->
          <div data-aos="fade-up" v-else>
            <v-img src="/img/ksri-logo.png" fit height="200"></v-img>
          </div>
          <div
            class="text-start pa-0 text-uppercase font-weight-bold"
            :class="!isHovering ? 'text-secondary' : 'text-primary'"
          >
            {{ book.title }}
          </div>

          <div
            class="horizontalLineSecondary"
            v-if="isHovering"
            style="--line-width: 15%"
          ></div>
          <div class="horizontalLine" v-else style="--line-width: 15%"></div>

          <div class="text-start pa-0 mt-5" data-aos-delay="100">
            {{ book.subtitle }}
          </div>
          <!-- price -->
          <div
            class="text-start pa-0 mt-5 text-primary font-weight-bold"
            data-aos-delay="300"
          >
            Price:
            <span class="text-secondary font-weight-bold">
              {{ book.price }}
            </span>
          </div>

          <div class="d-flex align-center justify-space-between mr-1">
            <!-- year of publication -->
            <div
              class="text-start pa-0 mt-5 text-primary font-weight-bold"
              data-aos-delay="300"
            >
              Year of Publication:
              <span class="text-secondary font-weight-bold">
                {{ getYearFromDate(book.yearOfPublication) }}
              </span>
            </div>

            <!-- show if out of stock -->
            <div
              class="text-start pa-0 mt-5 text-danger"
              v-if="book.available != 'Yes'"
              data-aos-delay="400"
            >
              <v-chip color="error" label outlined rounded="pill">
                Out of Stock
              </v-chip>
            </div>
          </div>
          <!-- icon to show if ebook is available -->
          <div
            class="text-start mt-5 d-flex justify-start"
            data-aos-delay="300"
            v-if="book.isEbookAvailable"
          >
            <v-btn
              rounded="pill"
              elevation="2"
              class="d-flex align-center pa-2"
              color="pageBackground"
              :to="
                '/ksri-publications/' +
                (isBook ? 'books' : 'journals') +
                '/' +
                book.id
              "
            >
              <v-icon color="primary" size="24" class="mr-2">
                mdi-book-open-page-variant
              </v-icon>
              <span class="text-primary font-weight-bold">
                Ebook is available
              </span>
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Second Row with Read More Button -->
      <div class="my-4 d-flex align-center">
        <div class="mx-1">
          <v-btn
            v-if="!fromEbook"
            :color="isHovering ? 'secondary' : 'primary'"
            text
            :to="
              '/ksri-publications/' +
              (isBook ? 'books' : 'journals') +
              '/' +
              book.id
            "
            rounded="pill"
            data-aos-delay="200"
          >
            View Details
          </v-btn>
          <v-btn
            v-if="fromEbook"
            :color="isHovering ? 'secondary' : 'primary'"
            text
            :to="'/ebooks/' + (isBook ? 'books' : 'journals') + '/' + book.id"
            rounded="pill"
            data-aos-delay="200"
          >
            View Details
          </v-btn>
        </div>

        <div
          class="horizontalLineSecondary mx-4"
          v-if="isHovering"
          style="--line-width: 100%"
        ></div>
        <div
          class="horizontalLine mx-4"
          v-else
          style="--line-width: 100%"
        ></div>
      </div>
    </v-card>
  </v-card>
</template>

<script>
export default {
  name: "BookCard",
  props: {
    book: {
      type: Object,
      required: true,
    },
    isBook: {
      type: Boolean,
      required: true,
      default: true,
    },
    fromEbook: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      isHovering: false,
    };
  },
  methods: {
    onReadMore() {
      console.log("Read more clicked for book:", this.book);
      // navigate to book details page
      // this.$router.push({
      //   name: "/ksri-publications/books",
      //   params: { id: this.book.title },
      // });
    },
    getImageUrl(url) {
      const runtimeConfig = useRuntimeConfig();
      return runtimeConfig.public.ASSET_DOMAIN + url;
    },
    getYearFromDate(date) {
      if (!this.isBook) return date;

      // if not a date or invalid date, return null
      if (!date || isNaN(new Date(date).getTime())) return null;
      // get year from date
      return new Date(date).getFullYear();
    },
  },
};
</script>
