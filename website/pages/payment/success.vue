<!-- src/views/Success.vue -->
<template>
  <v-container>
    <v-card class="pa-5 text-center">
      <v-icon color="green" size="80">mdi-check-circle</v-icon>
      <v-card-title>Payment Successful</v-card-title>
      <v-card-text>Your payment was processed successfully.</v-card-text>

      <v-btn color="primary" href="/user/bookshelf">View BookShelf</v-btn>
    </v-card>
  </v-container>
</template>

<script>
export default {
  mounted() {
    console.log("Payment success data:", this.$route.query);
  },
  methods: {},
};
</script>
