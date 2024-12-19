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
      <v-row>
        <!-- Title and Details Column -->
        <v-col cols="12" sm="12" class="py-2">
          <!-- image -->
          <div data-aos="fade-up" v-if="book.imageUrls">
            <v-img :src="book.imageUrls[0]" fit height="200"></v-img>
          </div>
          <!-- else display logo -->
          <div data-aos="fade-up" v-else>
            <v-img src="/img/ksri-logo.png" fit height="200"></v-img>
          </div>
          <div
            class="text-start pa-0"
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
          <div class="text-start pa-0 mt-5 text-secondary" data-aos-delay="300">
            Price: {{ book.price }}
          </div>
        </v-col>
      </v-row>

      <!-- Second Row with Read More Button -->
      <div class="my-4 d-flex align-center">
        <div class="mx-1">
          <v-btn
            :color="isHovering ? 'secondary' : 'primary'"
            text
            :to="
              '/academic-and-research-pursuits/ksri-publications/books/' +
              book.id
            "
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
      //   name: "/academic-and-research-pursuits/ksri-publications/books",
      //   params: { id: this.book.title },
      // });
    },
  },
};
</script>
