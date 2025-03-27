<template>
  <div class="floating-icons-container">
    <v-card
      elevation="2"
      class="icon-panel"
      :class="{ 'panel-collapsed': isCollapsed }"
    >
      <v-list
        dense
        style="background-color: rgb(191, 100, 31, 0.5)"
        class="pa-0 ma-0"
      >
        <v-list-item class="toggle-list-item pa-0 ma-0" @click="togglePanel">
          <v-list-item-icon class="pa-0 ma-0">
            <v-icon color="primary" class="pa-0 ma-0">
              {{ isCollapsed ? "mdi-chevron-left" : "mdi-chevron-right" }}
            </v-icon>
          </v-list-item-icon>
        </v-list-item>

        <template v-if="!isCollapsed">
          <v-divider></v-divider>

          <search />

          <template v-for="(link, index) in socialMediaLinks" :key="link.name">
            <v-list-item :href="link.url" target="_blank" class="icon-item">
              <v-list-item-icon>
                <v-icon color="primary">{{ link.icon }}</v-icon>
              </v-list-item-icon>
            </v-list-item>

            <v-divider v-if="index < socialMediaLinks.length - 1"></v-divider>
          </template>
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
      isCollapsed: false,
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
  methods: {
    togglePanel() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
};
</script>

<style scoped>
.floating-icons-container {
  position: fixed;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
}

.icon-panel {
  background-color: white;
  transition: height 0.3s ease, max-height 0.3s ease;
  overflow: hidden;
}

.toggle-list-item {
  cursor: pointer;
  text-align: center;
}

.icon-item {
  cursor: pointer;
  padding: 8px;
}

.panel-collapsed {
  height: auto;
  max-height: 50px;
}
</style>
