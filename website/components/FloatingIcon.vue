<template>
  <div class="floating-icons-panel">
    <v-card elevation="2" class="icon-panel">
      <v-list dense>
        <template v-for="(link, index) in socialMediaLinks" :key="link.name">
          <v-list-item :href="link.url" target="_blank" class="icon-item">
            <v-list-item-icon>
              <v-icon color="primary">{{ link.icon }}</v-icon>
            </v-list-item-icon>
          </v-list-item>

          <v-divider v-if="index < socialMediaLinks.length - 1"></v-divider>
        </template>
      </v-list>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "FloatingIcons",
  data() {
    return {
      socialMediaLinks: [
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
        {
          name: "Email",
          url: "mailto:ksrinst@gmail.com",
          icon: "mdi-email",
        },
      ],
    };
  },
};
</script>

<style scoped>
.floating-icons-panel {
  position: fixed;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
}

.icon-panel {
  background-color: white;
}

.icon-item {
  cursor: pointer;
  padding: 8px;
}
</style>
