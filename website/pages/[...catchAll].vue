<template>
  <v-card class="mx-auto my-12" max-width="500" elevation="8">
    <v-card-title class="text-white text-h4 font-weight-bold">
      Page Not Found
    </v-card-title>

    <v-card-text class="text-center py-4">
      <v-icon size="64" color="error" class="mb-4"> mdi-alert-circle </v-icon>

      <div class="text-h6 mb-3">
        We couldn't find the page you were looking for
      </div>

      <div class="text-subtitle-1">
        Redirecting to home page in
        <span class="font-weight-bold">{{ countdown }}</span> seconds...
      </div>

      <v-progress-linear
        v-model="progress"
        color="deep-purple accent-4"
        rounded
        height="6"
        class="mt-4"
      ></v-progress-linear>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" variant="flat" @click="goHome">
        Go Home Now
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      countdown: 3,
      timer: null,
      progress: 0,
    };
  },
  mounted() {
    // Start the countdown timer
    this.timer = setInterval(() => {
      this.countdown--;
      this.progress = (3 - this.countdown) * 33.33; // Update progress bar

      if (this.countdown <= 0) {
        clearInterval(this.timer);
        this.goHome();
      }
    }, 1000);
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },
  },
  beforeDestroy() {
    // Clean up timer when component is destroyed
    clearInterval(this.timer);
  },
};
</script>
