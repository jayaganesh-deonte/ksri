<!-- src/views/Failed.vue -->
<template>
  <v-container>
    <v-card class="pa-5 text-center">
      <v-icon color="red" size="80">mdi-alert-circle</v-icon>
      <div class="text-h5">Payment Failed</div>
      <div class="text-h6">
        Something went wrong with your payment. Please try again or contact us.
      </div>
      <v-btn color="primary" @click="$router.push(ebookUrl)">View Book</v-btn>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      ebookUrl: "/ksri-publications",
    };
  },
  mounted() {
    console.log("Payment failure data:", this.$route.query);

    // get ebookPage from localStorage
    const ebookPage = localStorage.getItem("ebookPage");
    if (ebookPage) {
      this.ebookUrl = ebookPage;
    }
  },
};
</script>
