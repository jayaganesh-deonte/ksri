import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#16A583",
          // secondary: "#FFE3B1",
          secondary: "#39797D",
          accent: "#F3F9FA",
          active: "#16A583",
        },
      },
    },
  },
});
