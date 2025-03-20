<!-- src/views/Success.vue -->
<template>
  <v-container>
    <v-card class="pa-5 text-center">
      <v-icon color="green" size="80">mdi-check-circle</v-icon>
      <v-card-title>Payment Successful</v-card-title>
      <v-card-text>Your payment was processed successfully.</v-card-text>

      <v-btn color="primary" @click="downloadReceipt">Download e-receipt</v-btn>
    </v-card>
  </v-container>
</template>

<script>
export default {
  mounted() {
    console.log("Payment success data:", this.$route.query);
  },
  methods: {
    downloadReceipt() {
      // Download receipt logic
      // get payment ref id from query
      const paymentRef = this.$route.query.order_id;
      const emailId = this.$route.query.email;
      console.log("Download receipt for payment ref:", paymentRef, emailId);

      // get current domain
      const domain = window.location.origin;
      const url = `${domain}/public/receipt/donation?paymentRefId=${paymentRef}&emailId=${emailId}`;
      window.open(url, "_blank");
    },
  },
};
</script>
