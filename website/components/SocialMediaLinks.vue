<template>
  <v-card color="transparent" class="pa-6 socialMediaFooter">
    <v-card class="pa-1">
      <div
        class="d-flex justify-space-around ma-4"
        :class="`${$device.isMobile ? 'flex-column' : 'flex-row '}`"
      >
        <v-card
          v-for="link in socialMediaLinks"
          :key="link.name"
          class="d-flex align-center socialMediaCards pa-2"
          elevation="0"
        >
          <v-btn
            :icon="link.icon"
            size="small"
            target="_blank"
            color="secondary"
          ></v-btn>
          <v-card-title>{{ link.name }}</v-card-title>
        </v-card>
      </div>
    </v-card>
  </v-card>
</template>

<script setup>
const socialMediaLinks = [
  {
    name: "Facebook",
    url: "ksri.in",
    icon: "mdi-facebook",
  },
  {
    name: "Twitter",
    url: "ksri.in",
    icon: "mdi-twitter",
  },
  {
    name: "Instagram",
    url: "ksri.in",
    icon: "mdi-instagram",
  },
  {
    name: "YouTube",
    url: "ksri.in",
    icon: "mdi-youtube",
  },
];

// on hover
</script>

<style scoped>
.socialMediaCards:hover {
  /*set #F5F5F5 as background color on hover*/
  background-color: #f5f5f5;
}

.socialMediaFooter {
  background-image: url("/img/icons/footer-background-flower.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
