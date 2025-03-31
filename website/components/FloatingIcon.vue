<template>
  <div class="floating-icons-container">
    <div class="d-flex ma-0 pa-0">
      <!-- First column - Toggle Button -->
      <div class="d-flex align-center justify-center pa-0 ma-0">
        <v-card elevation="2" class="icon-panel pa-0 ma-0" rounded="0">
          <v-list
            dense
            style="background-color: rgb(191, 100, 31, 0.5)"
            class="pa-0 ma-0"
            width="20px"
          >
            <v-list-item
              class="toggle-list-item pa-0 ma-0 d-flex justify-center"
              @click="togglePanel"
            >
              <v-list-item-icon class="pa-0 ma-0 d-flex justify-center">
                <v-icon color="primary" class="pa-0 ma-0">
                  {{ isCollapsed ? "mdi-chevron-left" : "mdi-chevron-right" }}
                </v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-card>
      </div>

      <!-- Second column - Icons Panel -->
      <v-card
        elevation="2"
        class="icon-panel no-gap"
        :class="{ 'panel-collapsed': isCollapsed }"
        v-if="!isCollapsed"
      >
        <v-list
          dense
          style="background-color: rgb(191, 100, 31, 0.5)"
          class="pa-0 ma-0"
        >
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

.toggle-column {
  width: 40px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.toggle-list-item {
  width: 100%;
  display: flex;
  justify-content: center;
}

.toggle-btn {
  background-color: transparent;
  margin: 0;
}

.icon-panel {
  background-color: white;
  transition: width 0.3s ease, max-width 0.3s ease;
  overflow: hidden;
}

.no-gap {
  margin-left: -1px; /* Remove the gap between toggle and icons panel */
}

.icon-item {
  cursor: pointer;
  padding: 8px;
}

.panel-collapsed {
  width: 0;
  max-width: 0;
  padding: 0;
  margin: 0;
  border: none;
}

/* Center the v-list-item-icon content */
.v-list-item-icon {
  justify-content: center;
  margin: auto !important;
}
</style>
