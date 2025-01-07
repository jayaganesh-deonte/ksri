<template>
  <v-card color="transparent" class="pa-2 mt-2">
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
          data-aos="fade-up"
          :data-aos-delay="`${socialMediaLinks.indexOf(link) * 200}`"
          :data-aos-duration="`${socialMediaLinks.indexOf(link) * 200}`"
          :href="link.url"
          target="_blank"
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
    url: "https://www.facebook.com/share/n4uT1gC5sb3GvXgF/?mibextid=wwXIfr",
    icon: "mdi-facebook",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@kuppuswamisastriresearchin6317",
    icon: "mdi-youtube",
  },
  // email
  {
    name: "Email",
    url: "mailto:ksrinst@gmail.com",
    icon: "mdi-email",
  },
];

// on hover
</script>

<style scoped>
.socialMediaCards:hover {
  /*set #F5F5F5 as background color on hover*/
  background-color: #f5f5f5;
}
</style>
