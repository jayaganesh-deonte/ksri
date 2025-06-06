<template>
  <v-card
    height="100%"
    class="d-flex flex-column"
    :elevation="isHovering ? 5 : 2"
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <v-img
      v-if="book.bookDetails.imageUrls && book.bookDetails.imageUrls.length > 0"
      :src="getAssetUrl(book.bookDetails.imageUrls[0])"
      height="200"
      fit
    ></v-img>
    <v-img v-else src="/img/ksri-logo.png" height="200" fit></v-img>

    <div
      class="text-start ma-2 text-uppercase font-weight-bold"
      :class="!isHovering ? 'text-secondary' : 'text-primary'"
    >
      {{ book.bookName }}
    </div>

    <div
      class="horizontalLineSecondary"
      v-if="isHovering"
      style="--line-width: 25%"
    ></div>

    <div>
      <p class="text-caption-1 ma-2">
        Purchased on {{ formatDate(book.paymentDate) }}
      </p>
      <p class="text-caption-1 ma-2">Author: {{ book.bookDetails.author }}</p>
    </div>

    <div class="ma-2 mt-auto">
      <!-- <v-btn
	              variant="tonal"
	              color="primary"
	              block
	              @click="readBook(book)"
	            >
	              Read Book
	              <v-icon icon="mdi-book-open-page-variant" class="ml-2"></v-icon>
	            </v-btn> -->

      <bookReader :book-info="book" />
    </div>
  </v-card>
</template>

<script setup>
const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
});

let isHovering = ref(false);

// Format date for display
const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch (e) {
    return dateString;
  }
};
</script>
